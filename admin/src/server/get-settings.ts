import { unstable_cache } from "next/cache";
import { db } from "@/server/db";

export const getSettings = unstable_cache(
  async () => {
    const s = await db.setting.findUnique({ where: { id: 1 } });
    if (!s) return null;
    // Normalize JSON string fields to arrays for consumers
    const locales = (() => {
      try {
        const v = (s as any).locales as unknown as string | null;
        return v ? (JSON.parse(v) as string[]) : ["tk", "ru", "en"];
      } catch {
        return ["tk", "ru", "en"];
      }
    })();
    const corsOrigins = (() => {
      try {
        const v = (s as any).corsOrigins as unknown as string | null;
        return v ? (JSON.parse(v) as string[]) : [];
      } catch {
        return [] as string[];
      }
    })();
    return { ...s, locales, corsOrigins } as any;
  },
  ["settings"],
  { tags: ["settings"], revalidate: 0 }
);
