/**
 * APIから取得する`User`の型
 * @property {string} user_id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */
export interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
}

/**
 * 記事表示に使用する`PostUser`の型
 * @property {string} user_id
 * @property {string} name
 */
export interface PostUser extends Pick<User, "user_id" | "name"> {}

/**
 * APIから取得する`Post`型を定義
 * @property {string} uuid
 * @property {string} title
 * @property {string} description
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Tag[]} tags
 * @property {Comment[]} comments
 * @property {PostUser[]} users
 */
export interface Post {
  uuid: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  comments: Comment[];
  users: PostUser[];
}

/**
 * APIから取得する`Tag`型を定義
 * @property {string} name
 */
export interface Tag {
  name: string;
}

/**
 * APIから取得する`Comment`の型
 * @property {string} uuid
 * @property {string} title
 * @property {string} description
 * @property {string} created_at
 * @property {string} updated_at
 * @property {PostUser[]} users
 */
export interface Comment {
  uuid: string;
  description: string;
  created_at: string;
  updated_at: string;
  users: PostUser[];
}

/**
 * 処理が成功した時の型
 * @template T 成功時の値の型
 * @property {true} success
 * @property {T} value
 */
interface Success<T> {
  success: true;
  value: T;
}

/**
 * 処理が失敗した時の型
 * @template E 失敗時のエラーの型
 * @property {false} success
 * @property {E} errors
 */
interface Failure<E> {
  success: false;
  errors: E;
}

/**
 * 汎用的な結果型
 * @template T 成功時の値の型
 * @template E 失敗時のエラーの型
 */
export type Result<T, E = unknown> = Success<T> | Failure<E>;
