import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule, MatProgressSpinnerModule } from "@angular/material";
import { ChatBotComponent } from "./chat-bot/chat-bot.component";
import { MainioFormsModule } from "mainio-forms";
import { MarkdownModule, MarkedOptions } from "ngx-markdown";
import { ChatBotComponentsModule } from "./chat-bot/chat-bot-components/chat-bot-components.module";

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
    ChatBotComponentsModule
  ],
  declarations: [ChatBotComponent],
  exports: [ChatBotComponent]
})
export class ComponentsModule {}
