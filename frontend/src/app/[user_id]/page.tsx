import { fetchPosts } from "@/lib/dataFetch";
import { postSchema } from "@/lib/schemas";
import { z } from "zod";

type Post = z.infer<typeof postSchema>;

export default async function Page({
  params: { user_id },
}: {
  params: { user_id: string };
}) {
  const postsData: Post[] = await fetchPosts(user_id);

  return (
    <main>
      <div className="min-w-full">
        {postsData.map((post, key) => (
          <article key={key} className="m-16">
            <h2 className="text-xl">{post.title}</h2>
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
                <p className="text-sm">{comment.users[0].name}</p>
                <p>{comment.description}</p>
              </div>
            ))}
          </article>
        ))}
      </div>
    </main>
  );
}
