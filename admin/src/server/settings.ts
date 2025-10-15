import { unstable_cache } from "next/cache";
import { db } from "@/server/db";

export const getSettings = unstable_cache(
  async () => {
    const settings = await db.setting.findUnique({ where: { id: 1 } });
    return settings;
  },
  ["settings"],
  { tags: ["settings"], revalidate: 0 }
);
