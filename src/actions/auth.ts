"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { initPocketBase as getPocketBase } from "@/lib/pocketbase";

const signInSchema = z.object({
  usernameOrEmail: z.string(),
  password: z.string(),
});

export async function signIn(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    usernameOrEmail: formData.get("usernameOrEmail"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const pb = await getPocketBase();
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
}

export async function signOut() {
  const pb = await getPocketBase();
  pb.authStore.clear();

  revalidatePath("/", "layout");
}
