import { cookies } from "next/headers";
import { generateContainerUrl } from "@/lib/generateParsedData";
import { authSuccessSchema } from "@/features/authentications/schemas/authentication";
import type { AuthResult } from "@/features/authentications/types/authentications.types";

export async function authHandler({
  path,
  payload,
}: {
  path: string;
  payload: object;
}): Promise<AuthResult> {
  try {
    const requestInit: RequestInit = {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Origin: "http://localhost",
      },
      body: JSON.stringify(payload),
    };

    const parsedUrl = generateContainerUrl(path);
    const response = await fetch(parsedUrl, requestInit);

    // HTTPレスポンスの成功確認
    if (!response.ok) {
      return {
        success: false,
        errors: [`HTTP ${response.status}: ${response.statusText}`],
      };
    }

    // Authorizationヘッダーの取得、存在確認
    const authHeader = response.headers.get("Authorization");

    if (!authHeader) {
      return {
        success: false,
        errors: ["Authorizationヘッダーが存在しません。"],
      };
    }

    // レスポンスのJSONの型を検証
    const json = await response.json();
    const parsedJson = authSuccessSchema.safeParse(json);

    if (!parsedJson.success) {
      return {
        success: false,
        errors: parsedJson.error.issues.map((i) => i.message),
      };
    }

    // BearerトークンをCookieに保存
    const bearerToken = authHeader.replace("Bearer ", "");
    const cookieStore = await cookies();

    cookieStore.set("access_token", bearerToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    // 検証済みのJSONデータを返す
    return parsedJson.data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: [`${error.name}: ${error.message}`],
      };
    }
    // Error型ではなかった際、Promiseの可能性を考慮し再度 throw する
    throw error;
  }
}
