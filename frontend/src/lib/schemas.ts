import { z } from "zod/v4";
import { passwordRegex, userIdRegex } from "./regexes";

export const urlSchema = z.url();

export const userIdSchema = z
  .string()
  .min(4, "ユーザーIDは4文字以上で入力してください。")
  .max(15, "ユーザーIDは15文字以下で入力してください。")
  .regex(userIdRegex, "半角英数字、半角アンダーバーのみで入力してください。")
  .trim();

export const emailSchema = z.email("Eメールの様式で入力してください。").trim();

export const passwordSchema = z
  .string()
  .min(8, "8文字以上で入力してください。")
  .max(100, "100文字以下で入力してください。")
  .regex(
    passwordRegex,
    "半角英小文字、大文字、数字、記号をそれぞれ1文字以上含めてください。"
  )
  .trim();

export const uuidSchema = z.uuid();

export const tagSchema = z.object({
  name: z.string(),
});

export const userSchema = z.object({
  user_id: userIdSchema,
  name: z.string().trim(),
  email: emailSchema,
  password: passwordSchema,
});

export const postUserSchema = userSchema.pick({ user_id: true, name: true });

export const commentSchema = z.object({
  uuid: uuidSchema,
  description: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  users: z.array(postUserSchema),
});

export const postSchema = z.object({
  uuid: uuidSchema,
  title: z.string(),
  description: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  tags: z.array(tagSchema),
  comments: z.array(commentSchema),
  users: z.array(postUserSchema),
});
