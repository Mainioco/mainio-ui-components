import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { MainioFormsModule } from "mainio-forms";
import { MainioChatBotComponent } from "./components/chat-bot/mainio-chat-bot.component";
import { MatButtonModule, MatProgressSpinnerModule } from "@angular/material";
import { MarkdownModule, MarkedOptions } from "ngx-markdown";
import { ActionRowComponent } from "./components/chat-bot/chat-bot-components/action-row/action-row.component";
import { ChatBotService } from "./services/chat-bot.service";
import { ChatBotActionService } from "./services/chat-bot-action.service";
import { BotActionsCompletedService } from "./services/bot-actions-completed.service";
import { ParameterParserService } from "./services/bot-response-parameter-parser/parameter-parser.service";
import { UrlParserService } from "./services/bot-response-parameter-parser/url-parser.service";
@NgModule({
  imports: [
    CommonModule,
    MainioFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: true,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false
        }
      }
    }),
    HttpModule
  ],
  providers: [
    ChatBotService,
    ChatBotActionService,
    BotActionsCompletedService,
    ParameterParserService,
    UrlParserService
  ],
  declarations: [MainioChatBotComponent, ActionRowComponent],
  exports: [MainioChatBotComponent, ActionRowComponent]
})
export class MainioChatBotModule {}
