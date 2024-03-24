import Link from "next/link";

import { signOut } from "@/actions/auth";
import { getPocketBase } from "@/lib/pocketbase";

export default async function Home() {
  const pb = await getPocketBase({ requireAuth: false });

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
      <Link href="/new">New bookmark</Link>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}