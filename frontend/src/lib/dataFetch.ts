import axios, { AxiosResponse } from "axios";
import { postSchema, urlSchema } from "./schemas";
import { z } from "zod";

type Post = z.infer<typeof postSchema>;

const origin: string = "http://web";

// APIサーバーから複数の投稿データを取得
export async function fetchPosts(user_id: string): Promise<Post[]> {
  const url: string = generateUrl(`/v1/users/${user_id}/posts`);

  try {
    const response: AxiosResponse = await axios.get(url, {
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

// URLを検証して生成する関数
function generateUrl(path: string): string {
  const parsedUrl = urlSchema.safeParse(`${origin}${path}`);

  if (!parsedUrl.success) throw new Error(parsedUrl.error.message);

  return parsedUrl.data;
}
