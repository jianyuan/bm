"use server";

import metascraper from "metascraper";
import metascraperDescription from "metascraper-description";
import metascraperLogoFavicon from "metascraper-logo-favicon";
import metascraperTitle from "metascraper-title";
import { z } from "zod";

import { authAction } from "./safe-action";

const metascraperInstance = metascraper([
  metascraperDescription(),
  metascraperLogoFavicon(),
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

export const getMetadataAction = authAction(z.string().url(), async (url) => {
  const content = await getContent(url);
  if (!content) {
    throw new Error("Failed to fetch content");
  }

  const metadata = await metascraperInstance({ html: content, url });
  return {
    title: metadata.title,
    favicon: metadata.logo,
    description: metadata.description,
  };
});
