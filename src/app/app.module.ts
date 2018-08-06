import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { MainioChatBotModule } from "MainioChatBot";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "../../node_modules/@angular/material";
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MainioChatBotModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
