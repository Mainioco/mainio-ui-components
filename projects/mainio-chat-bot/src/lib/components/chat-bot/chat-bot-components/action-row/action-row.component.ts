import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { IChatBotAction } from "../../../../services/chat-bot-action.service";

@Component({
  selector: "app-action-row",
  templateUrl: "./action-row.component.html",
  styleUrls: ["./action-row.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionRowComponent {
  @Input() action: IChatBotAction;
  @Output()
  onclick: EventEmitter<IChatBotAction> = new EventEmitter<IChatBotAction>();

  constructor() {}

  buttonClicked(event) {
    this.onclick.emit(this.action);
  }
}
