import { z } from "zod/v4";
import { urlSchema, userIdSchema, uuidSchema } from "./schemas";
import type { Result } from "@/types/types";

/** Zodで検証してデータを返す関数 */
function generateParsedData<T extends z.ZodType>(params: {
  schema: T;
  data: unknown;
}): Result<z.infer<T>, string[]> {
  const { schema, data } = params;
  const parsedData = schema.safeParse(data);
  if (!parsedData.success)
    return {
      success: false,
      errors: parsedData.error.issues.map((i) => i.message),
    };
  return { success: true, value: parsedData.data };
}

/** URLを検証、生成する関数 */
function generateUrl(params: {
  origin: string;
  path: string;
}): Result<string, string[]> {
  const { origin, path } = params;
  const url = `${origin}${path}`;
  const parsed = generateParsedData({ schema: urlSchema, data: url });
  if (!parsed.success) return parsed;

  return { success: true, value: parsed.value };
}

/** Dockerのコンテナ用のURLを検証、生成する関数 */
export function generateContainerUrl(path: string): Result<string, string[]> {
  const origin: string = "http://web";
  return generateUrl({ origin: origin, path: path });
}

/** ユーザーIdを検証、生成する関数 */
export function generateUserId(userId: string): Result<string, string[]> {
  const parsed = generateParsedData({ schema: userIdSchema, data: userId });
  if (!parsed.success) return parsed;

  return { success: true, value: parsed.value };
}

/** UUIDを検証、生成する関数 */
export function generateUuid(uuid: string): Result<string, string[]> {
  const parsed = generateParsedData({ schema: uuidSchema, data: uuid });
  if (!parsed.success) return parsed;

  return { success: true, value: parsed.value };
}
