import axios, { AxiosResponse } from "axios";
import { postSchema, urlSchema, userIdSchema, uuidSchema } from "./schemas";
import { z } from "zod";
import { generateParsedData } from "./generateParsedData";

type Post = z.infer<typeof postSchema>;

const origin: string = "http://web";

/** APIサーバーから複数の投稿データを取得 */
export async function fetchPosts(userId: string): Promise<Post[]> {
  const parsedUserId: string = generateUserId(userId);
  const parsedUrl: string = generateUrl(`/v1/users/${parsedUserId}/posts`);

  try {
    const response: AxiosResponse = await axios.get(parsedUrl, {
      insecureHTTPParser: true,
    });

    const parsedData = postSchema.array().safeParse(response.data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach((issue) => {
        console.error(
          `バリデーションエラー ${issue.path.join(".")}: ${issue.message}`
        );
      });
      throw new Error("無効なレスポンスデータ形式です");
    }

    return parsedData.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API呼び出しに失敗:", error.message);
      throw new Error("APIからの投稿の取得に失敗しました");
    }
    console.error("予期しないエラー:", error);
    throw new Error("予期しないエラーが発生しました");
  }
}

/** APIサーバーから単一の投稿データを取得 */
export async function fetchPost(params: { userId: string; postUuid: string }) {
  const { userId, postUuid } = params;
  const parsedUserId: string = generateUserId(userId);
  const parsedPostUuid: string = generateUuid(postUuid);
  const parsedUrl: string = generateUrl(
    `/v1/users/${parsedUserId}/posts/${parsedPostUuid}`
  );

  try {
    const response: AxiosResponse = await axios.get(parsedUrl, {
      insecureHTTPParser: true,
    });

    const parsedData = postSchema.safeParse(response.data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach((issue) => {
        console.error(
          `バリデーションエラー ${issue.path.join(".")}: ${issue.message}`
        );
      });
      throw new Error("無効なレスポンスデータ形式です");
    }

    return parsedData.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API呼び出しに失敗:", error.message);
      throw new Error("APIからの投稿の取得に失敗しました");
    }
    console.error("予期しないエラー:", error);
    throw new Error("予期しないエラーが発生しました");
  }
}

/** URLを検証、生成する関数 */
function generateUrl(path: string): string {
  const url: string = `${origin}${path}`;
  return generateParsedData({ schema: urlSchema, data: url });
}

/** ユーザーIdを検証、生成する関数 */
function generateUserId(userId: string): string {
  return generateParsedData({ schema: userIdSchema, data: userId });
}

/** UUIDを検証、生成する関数 */
function generateUuid(uuid: string): string {
  return generateParsedData({ schema: uuidSchema, data: uuid });
}
