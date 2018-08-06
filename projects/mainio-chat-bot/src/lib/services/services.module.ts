import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatBotService } from "./chat-bot.service";
import { BotResponseParameterParserModule } from "./bot-response-parameter-parser/bot-response-parameter-parser.module";

@NgModule({
  imports: [CommonModule, BotResponseParameterParserModule],
  declarations: [],
  providers: [ChatBotService]
})
export class ServicesModule {}
