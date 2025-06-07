import { z } from "zod/v4";
import { passwordRegex, userIdRegex } from "./regexes";

export const urlSchema = z.url();
export const userIdSchema = z.string().min(4).max(15).regex(userIdRegex);
export const uuidSchema = z.uuid();

export const tagSchema = z.object({
  name: z.string(),
});

export const userSchema = z.object({
  user_id: userIdSchema,
  name: z.string(),
  email: z.email(),
  password: z.string().min(8).max(100).regex(passwordRegex),
});

export const commentSchema = z.object({
  uuid: uuidSchema,
  description: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  users: z.array(userSchema),
});

export const postSchema = z.object({
  uuid: uuidSchema,
  title: z.string(),
  description: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  tags: z.array(tagSchema),
  comments: z.array(commentSchema),
  users: z.array(userSchema),
});
