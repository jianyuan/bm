import { Box } from "@mantine/core";

import { getReadableContentAction } from "@/actions/get-readable-content-action";
import { getPocketBase } from "@/lib/pocketbase";

export default async function BookmarkPage({
  params,
}: {
  params: { id: string };
}) {
  const pb = await getPocketBase();

  const bookmark = await pb.from("bookmarks").getOne(params.id);
  const { data } = await getReadableContentAction(bookmark.url);

  return (
    <Box>
      <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}
