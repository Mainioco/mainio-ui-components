import { BotResponseParameterParserModule } from './bot-response-parameter-parser.module';

describe('BotResponseParameterParserModule', () => {
  let botResponseParameterParserModule: BotResponseParameterParserModule;

  beforeEach(() => {
    botResponseParameterParserModule = new BotResponseParameterParserModule();
  });

  it('should create an instance', () => {
    expect(botResponseParameterParserModule).toBeTruthy();
  });
});
