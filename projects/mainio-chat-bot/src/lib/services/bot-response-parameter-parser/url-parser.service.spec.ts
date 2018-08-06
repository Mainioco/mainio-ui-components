import { TestBed, inject } from '@angular/core/testing';

import { UrlParserService } from './url-parser.service';

describe('UrlParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlParserService]
    });
  });

  it('should be created', inject([UrlParserService], (service: UrlParserService) => {
    expect(service).toBeTruthy();
  }));
});
