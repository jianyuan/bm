"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  try {
    const bookmark = await pb.from("bookmarks").create({
      ...validatedFields.data,
      user: pb.authStore.model?.id,
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
