import { z } from "zod";

/** Zodで検証してデータを返す関数 */
export function generateParsedData<T extends z.ZodTypeAny>(params: {
  schema: T;
  data: unknown;
}) {
  const { schema, data } = params;
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) throw new Error(parsedData.error.message);
  return parsedData.data as z.infer<T>;
}
