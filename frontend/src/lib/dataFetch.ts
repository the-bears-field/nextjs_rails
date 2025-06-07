import { postSchema } from "./schemas";
import { z } from "zod/v4";
import {
  generateUrl,
  generateUserId,
  generateUuid,
} from "./generateParsedData";

type Post = z.infer<typeof postSchema>;

/** APIサーバーから複数の投稿データを取得 */
export async function fetchPosts(userId: string): Promise<Post[]> {
  const parsedUserId: string = generateUserId(userId);
  const parsedUrl: string = generateUrl(`/v1/users/${parsedUserId}/posts`);

  return await fetchData({ url: parsedUrl, schema: postSchema.array() });
}

/** APIサーバーから単一の投稿データを取得 */
export async function fetchPost(params: {
  userId: string;
  postUuid: string;
}): Promise<Post> {
  const { userId, postUuid } = params;
  const parsedUserId: string = generateUserId(userId);
  const parsedPostUuid: string = generateUuid(postUuid);
  const parsedUrl: string = generateUrl(
    `/v1/users/${parsedUserId}/posts/${parsedPostUuid}`
  );

  return await fetchData({ url: parsedUrl, schema: postSchema });
}

/** APIサーバーからデータを取得 */
async function fetchData<T extends z.ZodType>(params: {
  schema: T;
  url: string;
}): Promise<z.infer<T>> {
  const { url, schema } = params;
  const response: Response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  const parsedData = schema.safeParse(json);

  if (!parsedData.success) {
    console.error(parsedData.error.issues);
    throw new Error(`ValidationError: ${parsedData.error.issues}`);
  }

  return parsedData.data;
}
