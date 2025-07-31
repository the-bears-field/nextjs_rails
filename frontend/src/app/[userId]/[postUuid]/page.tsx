import { fetchPost } from "@/lib/dataFetch";
import { Post } from "@/lib/types";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; postUuid: string }>;
}) {
  const { userId, postUuid } = await params;
  const postData: Post = await fetchPost({
    userId: userId,
    postUuid: postUuid,
  });

  return (
    <main>
      <div className="min-w-full">
        <article className="m-16">
          <h2 className="text-xl">{postData.title}</h2>
          <p className="mt-4">{postData.description}</p>
          <div className="flex flex-row mt-4">
            {postData.tags.map((tag, key) => (
              <span key={key} className="mr-6">
                {`#${tag.name}`}
              </span>
            ))}
          </div>
          {postData.comments.map((comment, key) => (
            <div key={key} className="m-4 ">
              <Link href={`../${comment.users[0].user_id}`} className="text-sm">
                {comment.users[0].name}
              </Link>
              <p>{comment.description}</p>
            </div>
          ))}
        </article>
      </div>
    </main>
  );
}
