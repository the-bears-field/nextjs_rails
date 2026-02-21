"use server";

import { userSchema } from "@/lib/schemas";
import { authHandler } from "@/features/authentications/lib/authHandler";
import type { AuthResult } from "@/features/authentications/types/authentications.types";

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

  return authHandler({
    path: "/v1/users/signup",
    payload: { user: parsedFormData.data },
  });
}
