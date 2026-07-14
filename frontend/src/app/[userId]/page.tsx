import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPosts } from "@/features/api/fetchData";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const result = await fetchPosts(userId);
  if (!result.success) return notFound();

  const postsdata = result.value;

  return (
    <section className="max-w-full">
      {postsdata.map((post, key) => (
        <article key={key} className="not-first:mt-32">
          <h2 className="text-3xl">
            <Link
              href={`${post.users[0].user_id}/${post.uuid}`}
              className="text-blue-400 hover:underline"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-4">{post.description}</p>
          <div className="flex flex-row mt-4">
            {post.tags.map((tag, key) => (
              <span key={key} className="mr-6">
                {`#${tag.name}`}
              </span>
            ))}
          </div>
          {post.comments.map((comment, key) => (
            <div key={key} className="m-4 ">
              <Link href={`${comment.users[0].user_id}`} className="text-sm">
                {comment.users[0].name}
              </Link>
              <p>{comment.description}</p>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
