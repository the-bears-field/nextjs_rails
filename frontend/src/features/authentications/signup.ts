"use server";

import { userSchema } from "@/lib/schemas";
import { AuthResult } from "./types/authentications.types";
import { generateContainerUrl } from "@/lib/generateParsedData";
import { authSuccessSchema } from "./schemas/authentication";
import { cookies } from "next/headers";

/**
 * 新規登録を行うアクション
 * 戻り値の詳細は下記バックエンドの`create`アクションを参照
 * /backend/app/controllers/v1/users/registrations_controller.rb
 * @param { FormData } formData フォームデータ
 * @returns { Promise<AuthResult> } 新規登録の結果
 */
export async function signup(formData: FormData): Promise<AuthResult> {
  const parsedFormData = userSchema.safeParse({
    user_id: formData.get("user_id"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedFormData.success) {
    return {
      success: false,
      errors: parsedFormData.error.issues.map((i) => i.message),
    };
  }

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
      body: JSON.stringify({
        user: parsedFormData.data,
      }),
    };

    const parsedUrl = generateContainerUrl("/v1/users");
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
