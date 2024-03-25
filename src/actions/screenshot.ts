"use server";

import captureWebsite from "capture-website";
import { eq } from "typed-pocketbase";

import { getPocketBase } from "@/lib/pocketbase";
import { ActionReturnType } from "@/types/action";

import { CaptureScreenshotSchema, captureScreenshotSchema } from "./schemas";

export default async function captureScreenshot(
  input: CaptureScreenshotSchema
): Promise<
  ActionReturnType<{
    id: string;
    screenshotUrl: string;
  }>
> {
  const validatedFields = captureScreenshotSchema.safeParse(input);
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { url } = validatedFields.data;

  const pb = await getPocketBase();

  // Check if we already have a screenshot for this URL
  let screenshot = await pb
    .from("screenshots")
    .getFirstListItem(eq("url", url), {
      select: {
        id: true,
        file: true,
      },
      sort: "-created",
    })
    .catch(() => null);

  // If we don't have a screenshot, capture one
  if (!screenshot) {
    const buffer = await captureWebsite.buffer(url).catch((err) => {
      console.error(err);
      return null;
    });

    if (!buffer) {
      return {
        success: false,
        errors: {
          url: ["Failed to capture screenshot"],
        },
      };
    }

    screenshot = await pb.from("screenshots").create({
      user: pb.authStore.model!.id,
      file: new File([buffer], "screenshot.png"),
      url,
    });
  }

  // Get a token to access the file
  const fileToken = await pb.files.getToken();
  const screenshotUrl = pb.files.getUrl(screenshot, screenshot.file, {
    token: fileToken,
  });

  return {
    success: true,
    data: {
      id: screenshot.id,
      screenshotUrl,
    },
  };
}
