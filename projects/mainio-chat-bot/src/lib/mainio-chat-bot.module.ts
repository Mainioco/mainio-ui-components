import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "./components/components.module";
import { ServicesModule } from "./services/services.module";
import { MainioFormsModule } from "mainio-forms";
import { MatCardModule, MatButtonModule } from "@angular/material";
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ServicesModule,
    MainioFormsModule,
    MatCardModule,
    MatButtonModule,
    HttpModule
  ],
  declarations: [],
  exports: [ComponentsModule]
})
export class MainioChatBotModule {}
