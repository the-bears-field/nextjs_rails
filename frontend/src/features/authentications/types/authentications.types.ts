import { Result, User } from "@/types/types";

/**
 * ユーザー新規登録の結果の型
 * @property {Omit<User, "password">} value 成功時のユーザー情報（パスワード除く）
 * @property {string[]} errors 失敗時のエラーメッセージ配列
 */
export type SignUpResult = Result<Omit<User, "password">, string[]>;
