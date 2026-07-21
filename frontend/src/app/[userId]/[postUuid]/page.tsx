import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPost } from "@/features/api/fetchData";
import type { Post } from "@/types/types";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; postUuid: string }>;
}) {
  const { userId, postUuid } = await params;
  const result = await fetchPost({
    userId: userId,
    postUuid: postUuid,
  });

  if (!result.success) return notFound();

  const postData: Post = result.value;

  return (
    <section className="ml-32 mt-32 mb-48 max-w-full">
      <article>
        <h2 className="text-3xl">{postData.title}</h2>
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
    </section>
  );
}
