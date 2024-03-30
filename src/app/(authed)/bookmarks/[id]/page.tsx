import { Box } from "@mantine/core";

import { fetchReadableContentAction } from "@/actions/fetch-readable-content-action";
import { getPocketBase } from "@/lib/pocketbase";

export default async function BookmarkPage({
  params,
}: {
  params: { id: string };
}) {
  const pb = await getPocketBase();

  const bookmark = await pb.from("bookmarks").getOne(params.id);
  const { data } = await fetchReadableContentAction({
    bookmarkId: bookmark.id,
  });

  return (
    <Box>
      <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}
