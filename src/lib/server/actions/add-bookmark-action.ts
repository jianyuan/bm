"use server";

import { revalidatePath } from "next/cache";
import { ClientResponseError } from "pocketbase";
import { and, eq } from "typed-pocketbase";

import { authActionClient } from "./action-client";
import { addBookmarkSchema } from "./schemas";

export const addBookmarkAction = authActionClient
  .schema(addBookmarkSchema)
  .action(async ({ parsedInput, ctx: { pb } }) => {
    const tags = await Promise.all(
      parsedInput.tags.map(async (tag) => {
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

    const favicon = parsedInput.favicon
      ? await fetch(parsedInput.favicon, { signal: AbortSignal.timeout(5000) })
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
        url: parsedInput.url,
        title: parsedInput.title || undefined,
        description: parsedInput.description || undefined,
        tags: tags.map((record) => record.id),
        favicon,
        screenshot: parsedInput.screenshot || undefined,
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
  });
