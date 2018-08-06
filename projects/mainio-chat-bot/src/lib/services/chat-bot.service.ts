import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { flatMap } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase,
  HttpErrorResponse
} from "@angular/common/http";

import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/catch";
import {
  IChatBotAction,
  IChatBotUserInputAction,
  ChatBotActionService
} from "./chat-bot-action.service";
import { ParameterParserService } from "./bot-response-parameter-parser/parameter-parser.service";
import { AskInput } from "./models/ask-input";

export class AskOutputDto implements IAskOutputDto {
  question: string | undefined;
  response: string | undefined;
  actions?: IChatBotAction[] | undefined;
  userActions?: IChatBotUserInputAction[] | undefined;

  constructor(data?: IAskOutputDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.userActions = data["result"]["userActions"];
      this.actions = data["result"]["actions"];
      this.question = data["result"]["question"];
      this.response = data["result"]["response"];
    }
  }

  static fromJS(data: any): AskOutputDto {
    data = typeof data === "object" ? data : {};
    let result = new AskOutputDto();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["question"] = this.question;
    data["response"] = this.response;
    return data;
  }
}

export interface IAskOutputDto {
  question: string | undefined;
  response: string | undefined;
  actions?: IChatBotAction[] | undefined;
  userActions?: IChatBotUserInputAction[] | undefined;
}
export interface BotStatus {
  enabled: boolean;
  conversionStarted: boolean;
}
export interface BotData {
  url: string;
}
@Injectable()
export class ChatBotService {
  _waitingAnswer: string = "";
  public apiPath: string;
  messages: Array<AskOutputDto> = [];
  waitingInputFor: IChatBotAction;
  waitingWizard: AskOutputDto;
  actionIndex: number = 0;
  useCache: boolean = false;
  private _botData: BotData = {
    url: ""
  };
  private _botStatus: BotStatus = {
    enabled: false,
    conversionStarted: false
  };
  public botStatus: Subject<BotStatus> = new Subject<BotStatus>();
  protected jsonParseReviver:
    | ((key: string, value: any) => any)
    | undefined = undefined;

  constructor(
    private _router: Router,
    private http: HttpClient,
    private _paramParser: ParameterParserService
  ) {
    _router.events.subscribe((event: NavigationEnd) => {
      this._botData.url = event.url;
    });
    this.botStatus.next(this._botStatus);
  }

  get isEnabled() {
    return this._botStatus.enabled;
  }

  getConversations() {}

  cancelInteraction(msg: string, response: string, silent: boolean = false) {
    if (!silent) {
      this.messages.push(
        new AskOutputDto({
          question: msg,
          response: response
        })
      );
    }
    this.waitingInputFor = undefined;
    this._waitingAnswer = undefined;
  }

  sendLocalMessage(
    msg: string,
    response: string,
    showActionNext?: IChatBotAction
  ) {
    this.messages.push(
      new AskOutputDto({
        question: msg,
        response: response,
        userActions: showActionNext ? showActionNext.userActions : undefined
      })
    );
    this.waitingInputFor = showActionNext;
  }

  async sendMessage(
    msg: string,
    showIfInvisible: boolean = true,
    wasUserInput: boolean = false
  ) {
    this.messages.push(
      new AskOutputDto({
        question: msg,
        response: this._waitingAnswer
      })
    );

    if (!this._botStatus.enabled && showIfInvisible) {
      this.showBot();
    }
    if (this.useCache) {
      this.http
        .get("./assets/mock/intent.json")
        .subscribe((x: HttpResponseBase) => {
          let ret = this.processAsk(x);
          ret.then(ret => {
            let ask = new AskOutputDto();
            ask.init(x);
            this.messages.push(ask);
            this.messages = this.cleanCachedMessages();
            this.messages = this.makeSureEachActionHasCancel(this.messages);
            if (ask.actions) {
              this.waitingWizard = ask;
            }
          });
        });
      return;
    }
    let obs: any = await this.ask({
      message: msg,
      wasSentByUserInputAction: wasUserInput
    });
    let ret = await this.processAsk(obs);
    this.messages.push(ret);
    this.messages = this.cleanCachedMessages();
    this.messages = this.makeSureEachActionHasCancel(this.messages);
    if (ret.actions) {
      this.waitingWizard = ret;
    }
  }

  showBot() {
    this._botStatus.enabled = true;
    this.botStatus.next(this._botStatus);
  }

  toggleBot() {
    this._botStatus.enabled = !this._botStatus.enabled;
    this.botStatus.next(this._botStatus);
  }

  makeSureEachActionHasCancel(messages: AskOutputDto[]): AskOutputDto[] {
    let filtered = [...messages];
    for (let i = 0; i < filtered.length; i++) {
      if (!filtered[i].actions) {
        continue;
      }
      filtered[i].userActions = this.makeSureHasCancelAction(
        filtered[i].userActions
      );
      for (let a = 0; a < filtered[i].actions.length; a++) {
        filtered[i].actions[a].userActions = this.makeSureHasCancelAction(
          filtered[i].actions[a].userActions
        );
      }
    }
    return filtered;
  }

  makeSureHasCancelAction(
    actionArr: IChatBotUserInputAction[]
  ): IChatBotUserInputAction[] {
    let filtered: IChatBotUserInputAction[] = !actionArr ? [] : [...actionArr];
    let hasCancel = false;
    for (let item of filtered) {
      if (item.inputValue.indexOf("cancel") !== -1) {
        hasCancel = true;
      }
    }
    if (!hasCancel) {
      filtered.push({
        label: "Nevermind",
        response: "Ok, let me know if you change your mind",
        inputValue: "cancel"
      });
    }
    return filtered;
  }

  hasCancelMethod(action: any) {}
  cleanCachedMessages(): AskOutputDto[] {
    let filtered: AskOutputDto[] = [];
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].response === this._waitingAnswer) {
        continue;
      }
      filtered.push(this.messages[i]);
    }
    return filtered;
  }

  /**
   * @question (optional)
   * @return Success
   */
  async ask(question: AskInput | null | undefined): Promise<ArrayBuffer> {
    let url_ = this.apiPath + "/api/services/app/FaqService/Ask";
    url_ = url_.replace(/[?&]$/, "");
    let options_: any = {
      body: JSON.stringify(question),
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json"
      })
    };

    return new Promise<ArrayBuffer>(resolve => {
      let obs = this.http.request("post", url_, options_);
      obs.subscribe(x => {
        resolve(x);
      });
    });
  }

  protected async processAsk(
    response: HttpResponseBase
  ): Promise<AskOutputDto> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    let result200: AskOutputDto = null;

    let res = await blobToText(responseBlob);
    return new Promise<AskOutputDto>(resolve => {
      let resultData200 =
        res === "" ? null : JSON.parse(res, this.jsonParseReviver);
      result200 = resultData200
        ? AskOutputDto.fromJS(resultData200)
        : new AskOutputDto();
      resolve(result200);
    });
  }
}

function blobToText(blob: any): Promise<string> {
  return new Promise<string>(resolve => {
    if (!blob) {
      resolve("");
    } else {
      let reader = new FileReader();
      reader.onload = function() {
        resolve(this.result);
      };
      reader.readAsText(blob);
    }
  });
}
