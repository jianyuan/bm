import {
  Anchor,
  Box,
  Button,
  Card,
  CardSection,
  Image,
  Pill,
  rem,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { Route } from "next";
import Link from "next/link";

import { signOut } from "@/actions/auth";
import { Favicon } from "@/components/Favicon";
import { getPocketBase } from "@/lib/pocketbase";

export default async function Home() {
  const pb = await getPocketBase();

  const fileToken = await pb.files.getToken();
  const bookmarks = (
    await pb.from("bookmarks").getFullList({
      select: {
        expand: {
          screenshot: true,
          tags: true,
        },
      },
    })
  ).map((bookmark) => ({
    ...bookmark,
    faviconUrl: bookmark.favicon
      ? pb.files.getUrl(bookmark, bookmark.favicon, { token: fileToken })
      : null,
    screenshotUrl: bookmark.expand?.screenshot
      ? pb.files.getUrl(
          bookmark.expand.screenshot,
          bookmark.expand.screenshot.file,
          {
            token: fileToken,
          }
        )
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
            {bookmark.screenshotUrl && (
              <CardSection>
                <Image
                  src={bookmark.screenshotUrl}
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

            <Anchor
              href={bookmark.url}
              target="_blank"
              size="sm"
              c="dimmed"
              styles={{
                root: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: rem(4),
                },
              }}
            >
              <Favicon src={bookmark.faviconUrl} size={16} />
              <Box
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {bookmark.url}
              </Box>
            </Anchor>

            {bookmark.expand?.tags && (
              <Box>
                {bookmark.expand.tags.map((tag) => (
                  <Pill key={tag.id}>{tag.name}</Pill>
                ))}
              </Box>
            )}

            <Text size="sm" c="dimmed" mt="lg">
              {bookmark.description}
            </Text>

            <Link href={`bookmarks/${bookmark.id}` as Route} passHref>
              <Button component="a">Details</Button>
            </Link>
          </Card>
        ))}
      </SimpleGrid>
    </main>
  );
}
