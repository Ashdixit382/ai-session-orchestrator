import { z } from "zod";
import mongoose from "mongoose";

export const objectIdSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: "Invalid ID",
});

export const createMessageSchema = z.object({
  body: z
    .object({
      content: z.string().trim().min(1).max(10000),
    })
    .strict(),

  params: z.object({
    conversationId: objectIdSchema,
  }),

  query: z.object({}),
});

export const updateMessageSchema = z.object({
  body: z
    .object({
      content: z.string().trim().min(1).max(10000),
    })
    .strict(),

  params: z.object({
    messageId: objectIdSchema,
  }),

  query: z.object({}),
});
