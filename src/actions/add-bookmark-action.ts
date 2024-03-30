"use server";

import { revalidatePath } from "next/cache";
import { ClientResponseError } from "pocketbase";
import { and, eq } from "typed-pocketbase";

import { authAction } from "./safe-action";
import { addBookmarkSchema } from "./schemas";

export const addBookmarkAction = authAction(
  addBookmarkSchema,
  async (input, { pb }) => {
    const tags = await Promise.all(
      input.tags.map(async (tag) => {
        try {
          return await pb
            .from("tags")
            .getFirstListItem(
              and(eq("user", pb.authStore.model!.id), eq("name", tag)),
              {
                select: {
                  id: true,
                  name: true,
                },
              }
            );
        } catch (err) {
          if (err instanceof ClientResponseError && err.status === 404) {
            return await pb.from("tags").create({
              user: pb.authStore.model!.id,
              name: tag,
            });
          }

          throw err;
        }
      })
    );

    const favicon = input.favicon
      ? await fetch(input.favicon, { signal: AbortSignal.timeout(5000) })
          .then(
            async (response) =>
              new File(
                [await response.blob()],
                response.url.substring(response.url.lastIndexOf("/") + 1)
              )
          )
          .catch((err) => {
            console.error("Failed to fetch favicon", err);
            return undefined;
          })
      : undefined;

    try {
      const bookmark = await pb.from("bookmarks").create({
        user: pb.authStore.model!.id,
        url: input.url,
        title: input.title || undefined,
        description: input.description || undefined,
        tags: tags.map((record) => record.id),
        favicon,
        screenshot: input.screenshot || undefined,
      });

      revalidatePath("/", "layout");
      return {
        success: true,
        data: { id: bookmark.id },
      };
    } catch (err) {
      console.error(err);
      // TODO: handle error
      throw err;
    }
  }
);
