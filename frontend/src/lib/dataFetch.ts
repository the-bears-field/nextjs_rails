import axios, { AxiosResponse } from "axios";
import { postSchema, urlSchema } from "./schemas";
import { z } from "zod";

type Post = z.infer<typeof postSchema>;

const origin: string = "http://web";

// APIサーバーから複数の投稿データを取得
export async function fetchPosts(user_id: string): Promise<Post[]> {
  const url: string = generateUrl(`/v1/users/${user_id}/posts`);

  const response: AxiosResponse = await axios.get(url, {
    insecureHTTPParser: true,
  });

  const parsedData = postSchema.array().safeParse(response.data);

  if (!parsedData.success) throw new Error(parsedData.error.message);

  return parsedData.data;
}

// URLを検証して生成する関数
function generateUrl(path: string): string {
  const parsedUrl = urlSchema.safeParse(`${origin}${path}`);

  if (!parsedUrl.success) throw new Error(parsedUrl.error.message);

  return parsedUrl.data;
}
