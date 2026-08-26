import { z } from "zod";

export const createConversationSchema = z
  .object({
    title: z.string().trim().min(1),
  })
  .strict();

export const updateConversationSchema = z
  .object({
    title: z.string().trim().min(1),
  })
  .strict();
