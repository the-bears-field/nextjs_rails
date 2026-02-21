"use server";

import { userSchema } from "@/lib/schemas";
import { authHandler } from "@/features/authentications/lib/authHandler";
import type { AuthResult } from "../types/authentications.types";

/**
 * ログインを行うアクション
 * 戻り値の詳細は下記バックエンドの`create`アクションを参照
 * /backend/app/controllers/v1/users/sessions_controller.rb
 * @param { FormData } formData フォームデータ
 * @returns { Promise<AuthResult> } ログインの結果
 */
export async function signin(formData: FormData): Promise<AuthResult> {
  // フォームデータのバリデーション
  const parsedFormData = userSchema
    .pick({ email: true, password: true })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!parsedFormData.success) {
    return {
      success: false,
      errors: parsedFormData.error.issues.map((i) => i.message),
    };
  }

  return authHandler({
    path: "/v1/users/signin",
    payload: { user: parsedFormData.data },
  });
}
