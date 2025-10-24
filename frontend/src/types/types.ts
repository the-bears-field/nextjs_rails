import z from "zod/v4";
import {
  commentSchema,
  postSchema,
  postUserSchema,
  tagSchema,
  userSchema,
} from "../lib/schemas";

/** APIから取得する `User` の型 */
export type User = z.infer<typeof userSchema>;

/** APIから取得する `PostUser` の型 */
export type PostUser = z.infer<typeof postUserSchema>;

/** APIから取得する `Post` の型 */
export type Post = z.infer<typeof postSchema>;

/** APIから取得する `Tag` の型 */
export type Tag = z.infer<typeof tagSchema>;

/** APIから取得する `Comment` の型 */
export type Comment = z.infer<typeof commentSchema>;

/**
 * 処理が成功した時の型
 * @template T 成功時の値の型
 * @property {true} success
 * @property {T} value
 */
type Success<T> = {
  success: true;
  value: T;
};

/**
 * 処理が失敗した時の型
 * @template E 失敗時のエラーの型
 * @property {false} success
 * @property {E} errors
 */
type Failure<E> = {
  success: false;
  errors: E;
};

/** 汎用的な結果型 */
export type Result<T, E = unknown> = Success<T> | Failure<E>;
