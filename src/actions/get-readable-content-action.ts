"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { z } from "zod";

import { authAction } from "./safe-action";

export const getReadableContentAction = authAction(
  z.string().url(),
  async (url) => {
    const jsdom = await JSDOM.fromURL(url);
    const reader = new Readability(jsdom.window.document, {
      keepClasses: false,
    });
    const article = reader.parse();
    return article;
  }
);
