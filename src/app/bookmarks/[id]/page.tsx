import { Box } from "@mantine/core";

import { getReadableContent } from "@/actions/content";
import { getPocketBase } from "@/lib/pocketbase";

export default async function BookmarkPage({
  params,
}: {
  params: { id: string };
}) {
  const pb = await getPocketBase();

  const bookmark = await pb.from("bookmarks").getOne(params.id);
  const content = await getReadableContent(bookmark.url);

  return (
    <Box>
      <div dangerouslySetInnerHTML={{ __html: content?.content ?? "" }} />
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </Box>
  );
}
