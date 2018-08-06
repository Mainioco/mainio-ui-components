import { TestBed, inject } from '@angular/core/testing';

import { ParameterParserService } from './parameter-parser.service';

describe('ParameterParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParameterParserService]
    });
  });

  it('should be created', inject([ParameterParserService], (service: ParameterParserService) => {
    expect(service).toBeTruthy();
  }));
});
