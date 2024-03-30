"use server";

import captureWebsite from "capture-website";
import { eq } from "typed-pocketbase";
import { z } from "zod";

import { authAction } from "./safe-action";

export const captureScreenshotAction = authAction(
  z.string().url(),
  async (url, { pb }) => {
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
      const buffer = await captureWebsite
        .buffer(url, { timeout: 30 })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (!buffer) {
        throw new Error("Failed to capture screenshot");
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
      id: screenshot.id,
      screenshotUrl,
    };
  }
);
