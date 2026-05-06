"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { generateContainerUrl } from "@/lib/generateParsedData";
import "server-only";

/**
 * サインアウトを行うアクション
 * @returns { Promise<void> } サインアウトの完了を示すPromise
 */
export async function signout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    // バックエンドへサインアウトのリクエストを送信
    if (token) {
      const apiUrl = generateContainerUrl("/v1/users/sign_out");

      // タイムアウト付きのfetch、またはエラーを許容する設計
      await fetch(apiUrl, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Origin: "http://localhost",
        },
      }).catch((error: Error) => {
        // サーバーにログを残す。
        console.error("[Signout Error] Backend synchronization failed:", error);
      });
    }
  } finally {
    // バックエンドとの通信の成否に関わらず、フロントエンドの認証情報は必ず破棄。
    cookieStore.delete("access_token");

    // Next.js のクライアントキャッシュを削除。
    // ログイン状態に依存するUI(ヘッダーなど)を即座に更新。
    revalidatePath("/", "layout");
  }
}
