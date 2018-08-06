import { ChatBotComponentsModule } from './chat-bot-components.module';

describe('ChatBotComponentsModule', () => {
  let chatBotComponentsModule: ChatBotComponentsModule;

  beforeEach(() => {
    chatBotComponentsModule = new ChatBotComponentsModule();
  });

  it('should create an instance', () => {
    expect(chatBotComponentsModule).toBeTruthy();
  });
});
