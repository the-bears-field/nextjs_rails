import { Result, User } from "@/types/types";

/**
 * ユーザー新規登録、ログインの結果の型
 * @property {Pick<User, "user_id">} value 成功時のユーザー情報（パスワード除く）
 * @property { { value: string } } errors 失敗時のエラーメッセージ
 */
export type AuthResult = Result<Pick<User, "user_id">, { value: string }>;
