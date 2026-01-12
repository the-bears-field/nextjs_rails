import { userSchema } from "@/lib/schemas";
import { z } from "zod/v4";

export const authSuccessSchema = z.object({
  value: userSchema.pick({ user_id: true }),
  success: z.literal(true),
});
