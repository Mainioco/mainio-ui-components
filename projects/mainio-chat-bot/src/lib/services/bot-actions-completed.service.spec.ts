import { TestBed, inject } from '@angular/core/testing';

import { BotActionsCompletedService } from './bot-actions-completed.service';

describe('BotActionsCompletedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BotActionsCompletedService]
    });
  });

  it('should be created', inject([BotActionsCompletedService], (service: BotActionsCompletedService) => {
    expect(service).toBeTruthy();
  }));
});
