import { postSchema } from "@/lib/schemas";
import { z } from "zod/v4";
import {
  generateContainerUrl,
  generateUserId,
  generateUuid,
} from "@/lib/generateParsedData";
import type { Result } from "@/types/types";
import type { FetchPostResult, FetchPostsResult } from "./type/api.type";
import "server-only";

/** APIサーバーから複数の投稿データを取得 */
export async function fetchPosts(userId: string): Promise<FetchPostsResult> {
  const userIdResult = generateUserId(userId);
  if (!userIdResult.success) return userIdResult;

  const parsedUserId: string = userIdResult.value;
  const urlResult = generateContainerUrl(`/v1/users/${parsedUserId}/posts`);
  if (!urlResult.success) return urlResult;

  const parsedUrl = urlResult.value;

  return await fetchData({ url: parsedUrl, schema: postSchema.array() });
}

/** APIサーバーから単一の投稿データを取得 */
export async function fetchPost(params: {
  userId: string;
  postUuid: string;
}): Promise<FetchPostResult> {
  const { userId, postUuid } = params;
  const userIdResult = generateUserId(userId);
  if (!userIdResult.success) return userIdResult;

  const parsedUserId: string = userIdResult.value;
  const postUuidResult = generateUuid(postUuid);
  if (!postUuidResult.success) return postUuidResult;

  const parsedPostUuid: string = postUuidResult.value;
  const urlResult = generateContainerUrl(
    `/v1/users/${parsedUserId}/posts/${parsedPostUuid}`,
  );
  if (!urlResult.success) return urlResult;

  const parsedUrl: string = urlResult.value;

  return await fetchData({ url: parsedUrl, schema: postSchema });
}

/** APIサーバーからデータを取得 */
async function fetchData<T extends z.ZodType>(params: {
  schema: T;
  url: string;
}): Promise<Result<z.infer<T>, string[]>> {
  const { url, schema } = params;
  const response: Response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  try {
    if (!response.ok) {
      return {
        success: false,
        errors: [`HTTP ${response.status}: ${response.statusText}`],
      };
    }

    const json = await response.json();
    const parsedData = schema.safeParse(json);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.issues.map((i) => i.message),
      };
    }

    return { success: true, value: parsedData.data };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
