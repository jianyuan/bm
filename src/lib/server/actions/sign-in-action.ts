"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { returnValidationErrors } from "next-safe-action";
import { ClientResponseError } from "pocketbase";

import { getPocketBase } from "@/lib/pocketbase";

import { actionClient } from "./action-client";
import { signInSchema } from "./schemas";

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    const pb = await getPocketBase({ requireAuth: false });

    try {
      await pb
        .collection("users")
        .authWithPassword(parsedInput.usernameOrEmail, parsedInput.password);
    } catch (err) {
      if (err instanceof ClientResponseError && err.status === 400) {
        returnValidationErrors(signInSchema, {
          usernameOrEmail: {
            _errors: [err.message],
          },
        });
      }

      console.error(err);
      throw err;
    }

    revalidatePath("/", "layout");
    redirect("/");
  });
