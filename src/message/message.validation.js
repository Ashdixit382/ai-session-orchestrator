import { z } from "zod";

export const createMessageSchema = z
  .object({
    content: z.string().trim().min(1),
  })
  .strict();

export const updateMessageSchema = z
  .object({
    content: z.string().trim().min(1),
  })
  .strict();
