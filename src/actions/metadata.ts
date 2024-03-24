"use server";

import metascraper from "metascraper";
import metascraperDescription from "metascraper-description";
import metascraperTitle from "metascraper-title";
import { z } from "zod";

const metascraperInstance = metascraper([
  metascraperDescription(),
  metascraperTitle(),
]);

async function getContent(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  return await response.text();
}

export async function getMetadata(url: string) {
  const validatedUrl = z.string().url().safeParse(url);
  if (!validatedUrl.success) {
    return null;
  }

  const content = await getContent(validatedUrl.data).catch((err) => {
    console.error(err);
    return null;
  });

  if (!content) {
    return null;
  }

  const metadata = await metascraperInstance({ html: content, url });
  return metadata;
}
