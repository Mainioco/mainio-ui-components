import { Injectable } from "@angular/core";
import { CachedValues } from "../chat-bot-action.service";
import { UrlParserService } from "./url-parser.service";
import { IParser } from "./iparser";

@Injectable({
  providedIn: "root"
})
export class ParameterParserService implements IParser {
  constructor(private _url: UrlParserService) {}

  public parseString(str: string, cachedResponses: CachedValues[]) {
    let message = str;
    message = this._url.parseString(message, cachedResponses);
    message = this.replaceArrayOccurances(message, cachedResponses);
    message = this.replaceStringOccurances(message, cachedResponses);
    return message;
  }

  private replaceArrayOccurances(str: string, cachedResponses: CachedValues[]) {
    let useValuesInIndexes: number[] = [];
    let works: string[] = str.split("[");
    let ret = str;
    for (let work of works) {
      let s = work.split("]");
      if (s.length === 0) {
        continue;
      }
      if (s[0].indexOf("-") !== -1) {
        let max = +s[0].split("-")[1];
        let min = +s[0].split("-")[0];

        let replace = "";
        for (let i = min; i < max; i++) {
          replace += i !== min ? "," : "";
          replace += cachedResponses[i].value;
        }
        let occ = "[" + s[0] + "]";
        ret = ret.replace(occ, replace);
      }
    }
    return ret;
  }
  private replaceStringOccurances(
    str: string,
    cachedResponses: CachedValues[]
  ) {
    let work = str;
    for (let i = 0; i < cachedResponses.length; i++) {
      work = work.replace("{" + i + "}", cachedResponses[i].value);
    }
    return work;
  }
}
