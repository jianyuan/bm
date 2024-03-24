import Link from "next/link";

import { signOut } from "@/actions/auth";
import { initPocketBase } from "@/lib/pocketbase";

export default async function Home() {
  const pb = await initPocketBase();

  const result = pb.authStore.isValid
    ? await pb.collection("bookmarks").getFullList()
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/signin">Sign in</Link>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
      <div>
        {pb.authStore.model
          ? `Logged in as ${pb.authStore.model.username}`
          : `Not logged in`}
      </div>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
