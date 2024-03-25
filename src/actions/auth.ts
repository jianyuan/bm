"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientResponseError } from "pocketbase";

import { getPocketBase } from "@/lib/pocketbase";
import { ActionReturnType } from "@/types/action";

import { SignInSchema, signInSchema } from "./schemas";

export async function signIn(
  input: SignInSchema
): Promise<ActionReturnType<never>> {
  const validatedFields = signInSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const pb = await getPocketBase({ requireAuth: false });
  try {
    await pb
      .collection("users")
      .authWithPassword(
        validatedFields.data.usernameOrEmail,
        validatedFields.data.password
      );
  } catch (err) {
    if (err instanceof ClientResponseError) {
      if (err.status === 400) {
        return {
          success: false,
          errors: {
            password: [err.message],
          },
        };
      }
    }

    console.error(err);
    throw err;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<ActionReturnType<never>> {
  const pb = await getPocketBase();
  pb.authStore.clear();

  revalidatePath("/", "layout");
  redirect("/");
}
