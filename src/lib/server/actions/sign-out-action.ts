"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authActionClient } from "./action-client";

export const signOutAction = authActionClient.action(
  async ({ ctx: { pb } }) => {
    pb.authStore.clear();

    revalidatePath("/", "layout");
    redirect("/");
  }
);
