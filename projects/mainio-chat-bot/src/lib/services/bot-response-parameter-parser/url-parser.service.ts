import { Injectable } from "@angular/core";
import { CachedValues } from "../chat-bot-action.service";
import { IParser } from "./iparser";

@Injectable({
  providedIn: "root"
})
export class UrlParserService implements IParser {
  constructor() {}

  public parseString(str: string, cachedResponses: CachedValues[]) {
    let message = str;
    message = this.parseCreateInternal(message, cachedResponses);
    return message;
  }

  private parseCreateInternal(str: string, cachedResponses: CachedValues[]) {
    let works: string[] = str.split("{");
    let ret = str;
    for (let work of works) {
      let s = work.split("}");
      if (s.length === 0) {
        continue;
      }
      if (s[0].indexOf("#") !== -1) {
        let urlMode = s[0].split("#")[0];
        let urlPointer = s[0].split("#")[1];
        let replace = this.getUrlMarkdown(urlMode).replace(
          "{0}",
          this.getUrlForPointer(urlPointer)
        );
        let occ = "{" + s[0] + "}";
        ret = ret.replace(occ, replace);
      }
    }
    return ret;
  }

  private getUrlForPointer(str: string) {
    switch (str) {
      case "create_cx_question":
        return "/app/main/cxQuestions/cxQuestion/create";
    }
    return str;
  }

  private getUrlMarkdown(str: string) {
    return "[here]({0}){:target=\"_blank\"}";
  }
}
