import { CachedValues } from "../chat-bot-action.service";

export interface IParser {
  parseString(str: string, cachedResponses: CachedValues[]): string;
}
