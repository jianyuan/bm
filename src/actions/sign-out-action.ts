"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { zfd } from "zod-form-data";

import { authAction } from "./safe-action";

export const signOutAction = authAction(zfd.formData({}), async (_, { pb }) => {
  pb.authStore.clear();

  revalidatePath("/", "layout");
  redirect("/");
});
