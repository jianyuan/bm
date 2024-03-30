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
    <div>
      <article
        className="prose prose-a:underline-offset-4 prose-a:underline"
        dangerouslySetInnerHTML={{ __html: data?.content ?? "" }}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
