"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientResponseError } from "pocketbase";

import { getPocketBase } from "@/lib/pocketbase";

import { action } from "./safe-action";
import { signInSchema } from "./schemas";

export const signInAction = action(signInSchema, async (input) => {
  const pb = await getPocketBase({ requireAuth: false });

  try {
    await pb
      .collection("users")
      .authWithPassword(input.usernameOrEmail, input.password);
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 400) {
      return {
        success: false,
        error: err.message,
      };
    }

    console.error(err);
    throw err;
  }

  revalidatePath("/", "layout");
  redirect("/");
});
