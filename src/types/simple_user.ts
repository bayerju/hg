import { z } from "zod";

export const SimpleUserSchema = z.object({
  username: z.string(),
  id: z.number(),
  clerkId: z.string(),
});
