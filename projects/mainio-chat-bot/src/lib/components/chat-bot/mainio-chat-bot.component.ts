import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from "@angular/core";
import { InputQuestion, QuestionBase } from "mainio-forms";
import { ChatBotService, IAskOutputDto } from "../../services/chat-bot.service";
import {
  ChatBotActionService,
  IChatBotUserInputAction
} from "../../services/chat-bot-action.service";

@Component({
  selector: "mainio-chat-bot",
  templateUrl: "./mainio-chat-bot.component.html",
  styleUrls: ["./mainio-chat-bot.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class MainioChatBotComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("chatContainer") chatContainer;
  enabled: boolean = false;
  location: string;
  questions: QuestionBase<any>[] = [
    new InputQuestion({
      key: "bot_input",
      label: "Type your question",
      type: "input",
      order: 3,
      required: true
    })
  ];
  @ViewChild("botWindow") botWindowElement: ElementRef;

  constructor(
    private _bot: ChatBotService,
    private _botActionService: ChatBotActionService
  ) {
    this._bot.botStatus.subscribe(x => {
      this.enabled = x.enabled;
    });
  }

  get messages(): Array<IAskOutputDto> {
    return this._bot.messages;
  }

  get messageCount(): number {
    return this._bot.messages.length;
  }
  ngOnInit() {
    this._bot.botStatus.subscribe(x => {
      this.enabled = x.enabled;
    });
  }

  sendMessage() {
    this._bot.sendMessage("Hello!");
  }
  onSubmitActions($event) {
    this.onSubmit.emit($event);
  }

  userActionReceived(event: IChatBotUserInputAction, message: IAskOutputDto) {
    this._botActionService.userReactedToInput(event, message);
  }

  showChatBot() {
    this._bot.toggleBot();
  }

  ngOnChanges(changes: any) {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
