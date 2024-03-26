import { z } from "zod";

export const signInSchema = z.object({
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1),
});
export type SignInSchema = z.infer<typeof signInSchema>;

export const addBookmarkSchema = z.object({
  url: z.string().trim().url(),
  title: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  tags: z.array(z.string().trim()),
  screenshot: z.string().nullable(),
});
export type AddBookmarkSchema = z.infer<typeof addBookmarkSchema>;

export const getMetadataSchema = z.object({
  url: z.string().url(),
});
export type GetMetadataSchema = z.infer<typeof getMetadataSchema>;

export const captureScreenshotSchema = z.object({
  url: z.string().url(),
});
export type CaptureScreenshotSchema = z.infer<typeof captureScreenshotSchema>;
