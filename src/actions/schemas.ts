import { z } from "zod";

export const signInSchema = z.object({
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1),
});
export type SignInSchema = z.infer<typeof signInSchema>;

export const addBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  tags: z.array(z.string().trim()),
  favicon: z.string().url().nullable(),
  screenshot: z.string().nullable(),
});
export type AddBookmarkSchema = z.infer<typeof addBookmarkSchema>;
