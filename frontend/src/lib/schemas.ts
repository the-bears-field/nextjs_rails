import { z } from "zod";

export const tagSchema = z.object({
  name: z.string(),
});

export const userSchema = z.object({
  user_id: z.string().min(4).max(15),
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
