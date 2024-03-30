"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { eq } from "typed-pocketbase";

import { ContentsResponse } from "@/types/pocketbase";

import { authAction } from "./safe-action";
import { fetchReadableContentSchema } from "./schemas";

export const fetchReadableContentAction = authAction(
  fetchReadableContentSchema,
  async ({ refetch, bookmarkId }, { pb }) => {
    const bookmark = await pb.from("bookmarks").getOne(bookmarkId);

    let content: ContentsResponse | null = null;
    if (!refetch) {
      content = await pb
        .from("contents")
        .getFirstListItem(eq("bookmark", bookmarkId), {
          sort: "-created",
        })
        .catch(() => null);
    }

    if (!content) {
      const jsdom = await JSDOM.fromURL(bookmark.url);
      const reader = new Readability(jsdom.window.document, {
        keepClasses: false,
      });
      const article = reader.parse();

      if (article) {
        content = await pb.from("contents").create({
          bookmark: bookmarkId,
          content: article.content,
          textContent: article.textContent,
        });
      }
    }

    return content;
  }
);
