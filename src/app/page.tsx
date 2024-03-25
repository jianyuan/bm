import {
  Anchor,
  Card,
  CardSection,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import Link from "next/link";

import { signOut } from "@/actions/auth";
import { getPocketBase } from "@/lib/pocketbase";

export default async function Home() {
  const pb = await getPocketBase();

  const fileToken = await pb.files.getToken();
  const bookmarks = (
    await pb.from("bookmarks").getFullList({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        expand: {
          screenshot: true,
        },
      },
    })
  ).map(({ expand, ...rest }) => ({
    ...rest,
    screenshot: expand?.screenshot
      ? pb.files.getUrl(expand.screenshot, expand.screenshot.file, {
          token: fileToken,
        })
      : null,
  }));

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
      <SimpleGrid cols={3}>
        {bookmarks.map((bookmark) => (
          <Card
            key={bookmark.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            {bookmark.screenshot && (
              <CardSection>
                <Image
                  src={bookmark.screenshot}
                  h={350}
                  w="auto"
                  fit="contain"
                  alt={bookmark.title}
                />
              </CardSection>
            )}

            <Anchor href={bookmark.url} target="_blank" fw={500}>
              {bookmark.title}
            </Anchor>
            <Anchor href={bookmark.url} target="_blank" size="sm" c="dimmed">
              {bookmark.url}
            </Anchor>

            <Text size="sm" c="dimmed" mt="lg">
              {bookmark.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </main>
  );
}
