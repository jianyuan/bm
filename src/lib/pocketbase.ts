import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PocketBase from "pocketbase";

import { TypedPocketBase } from "@/types/pocketbase";

const COOKIE_NAME = "bm_auth_token";

export async function getPocketBase({ requireAuth } = { requireAuth: true }) {
  noStore();

  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL
  ) as TypedPocketBase;

  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    pb.authStore.save(token);
  }

  pb.authStore.onChange(() => {
    try {
      if (pb.authStore.token) {
        cookieStore.set(COOKIE_NAME, pb.authStore.token);
      } else {
        cookieStore.delete(COOKIE_NAME);
      }
    } catch (_) {}
  });

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch (_) {
    pb.authStore.clear();
  }

  if (requireAuth && !pb.authStore.isValid) {
    redirect("/signin");
  }

  return pb;
}
