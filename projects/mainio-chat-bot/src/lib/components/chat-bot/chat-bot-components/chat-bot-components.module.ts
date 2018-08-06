import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActionRowComponent } from "./action-row/action-row.component";
import { MatButtonModule } from "@angular/material";

const COMPONENTS = [ActionRowComponent];
@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class ChatBotComponentsModule {}
