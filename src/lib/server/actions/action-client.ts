import { createSafeActionClient } from "next-safe-action";

import { getPocketBase } from "@/lib/pocketbase";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const pb = await getPocketBase();
  return next({ ctx: { pb } });
});
