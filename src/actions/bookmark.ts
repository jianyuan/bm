"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPocketBase } from "@/lib/pocketbase";

import { AddBookmarkSchema, addBookmarkSchema } from "./schemas";

export async function addBookmark(
  input: AddBookmarkSchema
): Promise<{ success: false; errors: Record<string, string[]> } | never> {
  const validatedFields = addBookmarkSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const pb = await getPocketBase();

  try {
    await pb.from("bookmarks").create({
      ...validatedFields.data,
      user: pb.authStore.model?.id,
    });
  } catch (err) {
    console.error(err);
    // TODO: handle error
    throw err;
  }

  revalidatePath("/", "layout");
  redirect("/");
}
