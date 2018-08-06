import { TestBed, inject } from '@angular/core/testing';

import { ChatBotActionService } from './chat-bot-action.service';

describe('ChatBotActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatBotActionService]
    });
  });

  it('should be created', inject([ChatBotActionService], (service: ChatBotActionService) => {
    expect(service).toBeTruthy();
  }));
});
