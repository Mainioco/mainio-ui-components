import { Injectable } from "@angular/core";
import { ChatBotService, IAskOutputDto } from "./chat-bot.service";
import { ParameterParserService } from "./bot-response-parameter-parser/parameter-parser.service";
import { Subject } from "rxjs";

export interface IChatBotAction {
  message: string;
  label: string;
  actionEvent: string;
  wishInput: boolean;
  inputRequired: boolean;
  acceptWhenAnswered: IChatBotUserInputAction;
  showIfAnswered: IChatBotUserInputAction[];
  followingActions: IChatBotAction[];
  userActions: IChatBotUserInputAction[];
}

export interface IChatBotUserInputAction {
  label: string;
  response: string;
  inputValue: string;
  sendRemoteMessage?: string;
}
export interface CachedValues {
  action: IChatBotUserInputAction | IChatBotAction;
  value: any;
}

export interface InteractionStatus {
  cachedValues: CachedValues[];
  wasSuccess: boolean;
}
@Injectable({
  providedIn: "root"
})
export class ChatBotActionService {
  private _cachedValues: CachedValues[] = [];
  useCache: boolean = false;
  public interactionEnded: Subject<InteractionStatus> = new Subject<
    InteractionStatus
  >();
  constructor(
    private _chatBotService: ChatBotService,
    private _parameterParser: ParameterParserService
  ) {}

  userGaveInputFor(
    action: IChatBotAction,
    message: IAskOutputDto,
    msg: string
  ) {
    this._cachedValues.push({
      action: action,
      value: msg
    });
    this.userInputedResponse(action, message, msg);
  }

  userInputedResponse(
    action: IChatBotAction,
    message: IAskOutputDto,
    msg: string,
    cacheValue: boolean = true,
    wasRoot: boolean = false
  ) {
    let next: IChatBotAction = message.actions
      ? message.actions[message.actions.indexOf(action) + 1]
      : undefined;
    if (!next) {
      this._chatBotService.sendLocalMessage("Begone", "Ok...");
      return;
    }
    this._chatBotService.sendLocalMessage(
      msg,
      this._parameterParser.parseString(next.message, this._cachedValues),
      next
    );
  }
  notifyInteractionEnd() {
    this.interactionEnded.next({
      wasSuccess: true,
      cachedValues: this._cachedValues
    });
  }
  userReactedToInput(
    action: IChatBotUserInputAction,
    message: IAskOutputDto,
    cacheValue: boolean = true,
    wasRoot: boolean = false
  ) {
    if (action.sendRemoteMessage) {
      this.notifyInteractionEnd();
      this._chatBotService.cancelInteraction("", "", true);
      this._chatBotService.sendMessage(action.sendRemoteMessage, true, true);
      return;
    }
    if (action.inputValue.indexOf("cancel") !== -1) {
      this.notifyInteractionEnd();
      this._chatBotService.cancelInteraction(
        action.label,
        this._parameterParser.parseString(action.response, this._cachedValues)
      );
      return;
    }
    if (action.inputValue.indexOf("end") !== -1) {
      this.notifyInteractionEnd();
      this._chatBotService.cancelInteraction(
        action.label,
        this.resolveIntentEndMessage()
      );
      return;
    }
    if (cacheValue) {
      this._cachedValues.push({
        action: action,
        value: action.inputValue
      });
    }
    let rootIndex = this._chatBotService.waitingWizard
      ? this._chatBotService.waitingWizard.userActions.indexOf(action)
      : message.userActions.indexOf(action);
    let next: IChatBotAction = message.actions ? message.actions[0] : undefined;
    if (rootIndex === -1) {
      let belongedTo: IChatBotAction = this.getUserActionForUserInput(
        action,
        this._chatBotService.waitingWizard
          ? this._chatBotService.waitingWizard
          : message
      );
      if (!belongedTo) {
        this._chatBotService.sendLocalMessage("Begone", "ok---");
        return;
      }
      if (belongedTo.followingActions) {
      } else {
        next = this._chatBotService.waitingWizard.actions[
          this._chatBotService.waitingWizard.actions.indexOf(belongedTo) + 1
        ];
      }
      if (
        !next &&
        this._chatBotService.waitingWizard.actions.indexOf(belongedTo) ==
          this._chatBotService.waitingWizard.actions.length - 1
      ) {
        this.notifyInteractionEnd();
        this._chatBotService.cancelInteraction(action.label, action.response);
        return;
      }
    }

    if (!next) {
      this._chatBotService.sendLocalMessage("Begone2", "ok...");
      return;
    }
    this._chatBotService.sendLocalMessage(
      action.label,
      this._parameterParser.parseString(next.message, this._cachedValues),
      next
    );
  }

  private resolveIntentEndMessage() {
    return "OK, I'll create this and let you know when I'm done...";
  }
  private getUserActionForUserInput(
    action: IChatBotUserInputAction,
    message: IAskOutputDto
  ): IChatBotAction {
    if (!message.actions) {
      return undefined;
    }
    for (let x of message.actions) {
      if (x.followingActions) {
        let following = this.RootScanActions(action, x.followingActions);
        if (following) {
          return following;
        }
      }
      if (x.userActions === undefined) {
        continue;
      }
      try {
        if (x.userActions.indexOf(action) !== -1) {
          return x;
        }
      } catch (ex) {}
    }
    return undefined;
  }

  private RootScanActions(
    action: IChatBotUserInputAction,
    actions: IChatBotAction[]
  ): IChatBotAction {
    for (let ac of actions) {
      if (ac.userActions.indexOf(action) !== -1) {
        return ac;
      }
      if (!ac.followingActions) {
        continue;
      }
      let subs = this.RootScanActions(action, ac.followingActions);
      if (subs) {
        return subs;
      }
    }
    return undefined;
  }
}
