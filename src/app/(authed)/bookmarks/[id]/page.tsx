import { getPocketBase } from "@/lib/pocketbase";
import { fetchReadableContentAction } from "@/lib/server/actions/fetch-readable-content-action";

export default async function BookmarkPage({
  params,
}: {
  params: { id: string };
}) {
  const pb = await getPocketBase();

  const bookmark = await pb.from("bookmarks").getOne(params.id);
  const result = await fetchReadableContentAction({
    bookmarkId: bookmark.id,
  });

  return (
    <div>
      <article
        className="prose prose-a:underline-offset-4 prose-a:underline"
        dangerouslySetInnerHTML={{ __html: result?.data?.content ?? "" }}
      />
      <pre>{JSON.stringify(result?.data, null, 2)}</pre>
    </div>
  );
}
