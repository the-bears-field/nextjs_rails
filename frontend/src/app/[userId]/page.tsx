import { fetchPosts } from "@/lib/dataFetch";
import { postSchema } from "@/lib/schemas";
import Link from "next/link";
import { z } from "zod";

type Post = z.infer<typeof postSchema>;

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const postsData: Post[] = await fetchPosts(userId);

  return (
    <main>
      <div className="min-w-full">
        {postsData.map((post, key) => (
          <article key={key} className="m-16">
            <h2 className="text-xl">
              <Link href={`${post.users[0].user_id}/${post.uuid}`}>
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
      </div>
    </main>
  );
}
