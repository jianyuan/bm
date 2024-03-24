import Link from "next/link";

import { signOut } from "@/actions/auth";
import { initPocketBase } from "@/lib/pocketbase";

export default async function Home() {
  const pb = await initPocketBase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/signin">Sign in</Link>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
      {pb.authStore.model
        ? `Logged in as ${pb.authStore.model.username}`
        : `Not logged in`}
    </main>
  );
}
