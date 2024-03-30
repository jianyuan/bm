import { createSafeActionClient } from "next-safe-action";

import { getPocketBase } from "@/lib/pocketbase";

export const action = createSafeActionClient();

export const authAction = createSafeActionClient({
  middleware: async () => {
    const pb = await getPocketBase();
    return { pb };
  },
});
