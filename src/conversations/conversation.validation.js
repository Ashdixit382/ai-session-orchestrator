import { z } from "zod";

export const createConversationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).max(200),
    })
    .strict(),

  params: z.object({}),

  query: z.object({}),
});

export const updateConversationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).max(200),
    })
    .strict(),

  params: z.object({}),

  query: z.object({}),
});
