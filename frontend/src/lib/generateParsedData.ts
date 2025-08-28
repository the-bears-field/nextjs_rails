import { z } from "zod/v4";
import { urlSchema, userIdSchema, uuidSchema } from "./schemas";

/** Zodで検証してデータを返す関数 */
export function generateParsedData<T extends z.ZodType>(params: {
  schema: T;
  data: unknown;
}) {
  const { schema, data } = params;
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) throw new Error(parsedData.error.message);
  return parsedData.data as z.infer<T>;
}

/** URLを検証、生成する関数 */
export function generateUrl(params: { origin: string; path: string }): string {
  const { origin, path } = params;
  const url: string = `${origin}${path}`;
  return generateParsedData({ schema: urlSchema, data: url });
}

//** Dockerのコンテナ用のURLを検証、生成する関数 */
export function generateContainerUrl(path: string): string {
  const origin: string = "http://web";
  return generateUrl({ origin: origin, path: path });
}

/** ユーザーIdを検証、生成する関数 */
export function generateUserId(userId: string): string {
  return generateParsedData({ schema: userIdSchema, data: userId });
}

/** UUIDを検証、生成する関数 */
export function generateUuid(uuid: string): string {
  return generateParsedData({ schema: uuidSchema, data: uuid });
}
