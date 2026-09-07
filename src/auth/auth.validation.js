import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(100),
      email: z.email(),
      password: z.string().min(8).max(128),
    })
    .strict(),

  params: z.object({}),

  query: z.object({}),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.email(),
      password: z.string().min(8).max(128),
    })
    .strict(),

  params: z.object({}),

  query: z.object({}),
});

export const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(1),
    })
    .strict(),

  params: z.object({}),

  query: z.object({}),
});

export const logoutSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(1),
    })
    .strict(),

  params: z.object({}),

  query: z.object({}),
});
