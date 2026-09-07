import { z } from "zod";

export const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(100).optional(),
      email: z.string().trim().email().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),

  params: z.object({}),
  query: z.object({}),
});

export const updateUserPasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).max(128),
    })
    .strict(),

  params: z.object({}),
  query: z.object({}),
});
