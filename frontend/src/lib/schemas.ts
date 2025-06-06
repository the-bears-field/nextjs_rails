import { z } from "zod";
import { passwordRegex, userIdRegex } from "./regexes";

export const urlSchema = z.string().url();
export const userIdSchema = z.string().min(4).max(15).regex(userIdRegex);
export const uuidSchema = z.string().uuid();

export const tagSchema = z.object({
  name: z.string(),
});

export const userSchema = z.object({
  user_id: userIdSchema,
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(100).regex(passwordRegex),
});

export const commentSchema = z.object({
  uuid: uuidSchema,
  description: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  users: z.array(userSchema),
});

export const postSchema = z.object({
  uuid: uuidSchema,
  title: z.string(),
  description: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  tags: z.array(tagSchema),
  comments: z.array(commentSchema),
  users: z.array(userSchema),
});
