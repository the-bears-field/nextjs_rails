import axios, { AxiosResponse } from "axios";
import { postSchema } from "./schemas";
import { z } from "zod";
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
export async function fetchPost(params: { userId: string; postUuid: string }) {
  const { userId, postUuid } = params;
  const parsedUserId: string = generateUserId(userId);
  const parsedPostUuid: string = generateUuid(postUuid);
  const parsedUrl: string = generateUrl(
    `/v1/users/${parsedUserId}/posts/${parsedPostUuid}`
  );

  return await fetchData({ url: parsedUrl, schema: postSchema });
}

/** APIサーバーからデータを取得 */
async function fetchData<T extends z.ZodTypeAny>(params: {
  schema: T;
  url: string;
}) {
  const { url, schema } = params;

  try {
    const response: AxiosResponse = await axios.get(url, {
      insecureHTTPParser: true,
    });

    const parsedData = schema.safeParse(response.data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach((issue) => {
        console.error(
          `バリデーションエラー ${issue.path.join(".")}: ${issue.message}`
        );
      });
      throw new Error("無効なレスポンスデータ形式です");
    }

    return parsedData.data as z.infer<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API呼び出しに失敗:", error.message);
      throw new Error("APIからの投稿の取得に失敗しました");
    }
    console.error("予期しないエラー:", error);
    throw new Error("予期しないエラーが発生しました");
  }
}
