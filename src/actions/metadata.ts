"use server";

import metascraper from "metascraper";
import metascraperDescription from "metascraper-description";
import metascraperTitle from "metascraper-title";

import { getPocketBase } from "@/lib/pocketbase";
import { ActionReturnType } from "@/types/action";

import { GetMetadataSchema, getMetadataSchema } from "./schemas";

const metascraperInstance = metascraper([
  metascraperDescription(),
  metascraperTitle(),
]);

async function getContent(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

  try {
    return await response.text();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getMetadata(input: GetMetadataSchema): Promise<
  ActionReturnType<{
    title?: string;
    description?: string;
  }>
> {
  const validatedFields = getMetadataSchema.safeParse(input);
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { url } = validatedFields.data;

  await getPocketBase();

  const content = await getContent(url);
  if (!content) {
    return {
      success: false,
      errors: {
        url: ["Failed to fetch content"],
      },
    };
  }

  const metadata = await metascraperInstance({ html: content, url });
  return {
    success: true,
    data: metadata,
  };
}
