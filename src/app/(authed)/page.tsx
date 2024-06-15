import { Route } from "next";
import Link from "next/link";

import { Favicon } from "@/components/Favicon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPocketBase } from "@/lib/pocketbase";
import { signOutAction } from "@/lib/server/actions/sign-out-action";

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
      sort: "-created",
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
      <form action={signOutAction}>
        <button type="submit">Sign out</button>
      </form>
      <div>
        {pb.authStore.model
          ? `Logged in as ${pb.authStore.model.username}`
          : `Not logged in`}
      </div>
      <Link href="/new">New bookmark</Link>
      <div className="grid grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id}>
            {bookmark.screenshotUrl && (
              <CardContent>
                <img
                  src={bookmark.screenshotUrl}
                  alt={bookmark.title}
                  className="h-[350px] w-auto object-contain"
                />
              </CardContent>
            )}

            <CardContent className="space-y-4">
              <div>
                <div>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-primary underline-offset-4 hover:underline text-sm font-medium"
                  >
                    {bookmark.title}
                  </a>
                </div>

                <div>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-secondary-foreground underline-offset-4 hover:underline space-x-1 inline-flex items-center text-sm font-medium"
                  >
                    <Favicon src={bookmark.faviconUrl} size={16} />
                    <span className="truncate">{bookmark.url}</span>
                  </a>
                </div>

                {bookmark.expand?.tags && (
                  <div>
                    {bookmark.expand.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {bookmark.description && (
                <div className="text-sm text-secondary-foreground">
                  {bookmark.description}
                </div>
              )}

              <div>
                <Button size="sm" asChild>
                  <Link href={`bookmarks/${bookmark.id}` as Route}>
                    Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
