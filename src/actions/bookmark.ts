"use server";

import { revalidatePath } from "next/cache";
import { ClientResponseError } from "pocketbase";
import { and, eq } from "typed-pocketbase";

import { getPocketBase } from "@/lib/pocketbase";
import { ActionReturnType } from "@/types/action";

import { AddBookmarkSchema, addBookmarkSchema } from "./schemas";

export async function addBookmark(
  input: AddBookmarkSchema
): Promise<ActionReturnType<{ id: string }>> {
  const validatedFields = addBookmarkSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const pb = await getPocketBase();

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

  try {
    const bookmark = await pb.from("bookmarks").create({
      user: pb.authStore.model!.id,
      url: input.url,
      title: input.title || undefined,
      description: input.description || undefined,
      tags: tags.map((record) => record.id),
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
