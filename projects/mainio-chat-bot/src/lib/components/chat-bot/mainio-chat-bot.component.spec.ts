import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MainioChatBotComponent } from "./mainio-chat-bot.component";

describe("ChatBotComponent", () => {
  let component: MainioChatBotComponent;
  let fixture: ComponentFixture<MainioChatBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainioChatBotComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainioChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
