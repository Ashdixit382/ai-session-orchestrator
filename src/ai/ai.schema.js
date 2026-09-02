import { z } from "zod";

export const conversationTitleSchema = z.string().trim().min(1).max(100);
