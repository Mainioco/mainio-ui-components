import { Injectable } from "@angular/core";
import {
  ChatBotActionService,
  InteractionStatus
} from "./chat-bot-action.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root"
})
export class BotActionsCompletedService {
  constructor(
    private http: HttpClient,
    private _actionService: ChatBotActionService
  ) {
    this._actionService.interactionEnded.subscribe(x => {
      if (x.wasSuccess) {
        this.postSuccess(x);
      } else {
        this.postCancel(x);
      }
      console.log("Posted success", x);
    });
  }

  postSuccess(x: InteractionStatus) {
    return this.post(x, true);
  }

  postCancel(x: InteractionStatus) {
    return this.post(x, false);
  }

  private post(x: InteractionStatus, wasSuccess: boolean) {
    let url_ =
      environment.apiPath +
      "/api/services/app/IntentResolverService/PostSuccessStatus";
    url_ = url_.replace(/[?&]$/, "");

    let options_: any = {
      body: JSON.stringify(x),
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
}
