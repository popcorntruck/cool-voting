import { z } from "zod";

export const createPollValidator = z.object({
  question: z.string().min(3).max(60),
  options: z
    .array(
      z.object({
        option: z.string().min(1).max(60),
      })
    )
    .min(1)
    .max(4),
});

export type CreatePollInputType = z.infer<typeof createPollValidator>;
