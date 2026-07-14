import type { Post, Result } from "@/types/types";

export type FetchPostResult = Result<Post, string[]>;
export type FetchPostsResult = Result<Post[], string[]>;
