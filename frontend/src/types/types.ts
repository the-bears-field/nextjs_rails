import z from "zod/v4";
import {
  commentSchema,
  postSchema,
  postUserSchema,
  tagSchema,
  userSchema,
} from "../lib/schemas";

export type User = z.infer<typeof userSchema>;
export type PostUser = z.infer<typeof postUserSchema>;
export type Post = z.infer<typeof postSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Comment = z.infer<typeof commentSchema>;

type Success<T> = {
  success: true;
  value: T;
};

type Failure<E> = {
  success: false;
  errors: E;
};

export type Result<T, E = unknown> = Success<T> | Failure<E>;
