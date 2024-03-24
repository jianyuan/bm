"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPocketBase } from "@/lib/pocketbase";

import { SignInSchema, signInSchema } from "./schemas";

export async function signIn(input: SignInSchema) {
  const validatedFields = signInSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
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
    return {
      errors: {
        password: "Invalid username or password",
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const pb = await getPocketBase();
  pb.authStore.clear();

  revalidatePath("/", "layout");
  redirect("/");
}
