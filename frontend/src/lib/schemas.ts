import { z } from "zod";

export const urlSchema = z.string().url();
export const userIdSchema = z
  .string()
  .min(4)
  .max(15)
  .regex(/^[a-zA-Z0-9_]{4,15}$/);

export const tagSchema = z.object({
  name: z.string(),
});

export const userSchema = z.object({
  user_id: userIdSchema,
  name: z.string(),
});

export const commentSchema = z.object({
  uuid: z.string().uuid(),
  description: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  users: z.array(userSchema),
});

export const postSchema = z.object({
  uuid: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  tags: z.array(tagSchema),
  comments: z.array(commentSchema),
  users: z.array(userSchema),
});
