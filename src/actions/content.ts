"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function getReadableContent(url: string) {
  // const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  // const html = await response.text();
  // const doc = parseHTML(html).document;
  const jsdom = await JSDOM.fromURL(url);
  const reader = new Readability(jsdom.window.document, { keepClasses: false });
  const article = reader.parse();
  return article;
}
