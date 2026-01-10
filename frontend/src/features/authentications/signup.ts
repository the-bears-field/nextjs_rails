"use server";

import { userSchema } from "@/lib/schemas";
import { AuthResult } from "./types/authentications.types";
import { generateContainerUrl } from "@/lib/generateParsedData";

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

    if (!response.ok) {
      return {
        success: false,
        errors: [`HTTP ${response.status}: ${response.statusText}`],
      };
    }

    return response.json();
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
