import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const SettingsSchema = z.object({
  brandName: z.string().min(2),
  slogan: z.string().min(2),
  primaryHex: z.string(),
  accentHex: z.string(),
  lightMode: z.boolean(),
  defaultLocale: z.enum(["tk", "ru", "en"]),
  locales: z.array(z.enum(["tk", "ru", "en"])).min(1),
  arEnabled: z.boolean(),
  aiBarEnabled: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  twitterHandle: z.string().optional().nullable(),
  canonicalHost: z.string().optional().nullable(),
  phonePublic: z.string().optional().nullable(),
  emailPublic: z.string().optional().nullable(),
  whatsappLink: z.string().optional().nullable(),
  telegramLink: z.string().optional().nullable(),
  instagramLink: z.string().optional().nullable(),
  tiktokLink: z.string().optional().nullable(),
  addressHQ: z.string().optional().nullable(),
  gaId: z.string().optional().nullable(),
  gtmId: z.string().optional().nullable(),
  metaPixelId: z.string().optional().nullable(),
  yandexMetrikaId: z.string().optional().nullable(),
  smtpFromName: z.string().optional().nullable(),
  smtpFromEmail: z.string().optional().nullable(),
  recaptchaSiteKey: z.string().optional().nullable(),
  corsOrigins: z.array(z.string()).optional().nullable(),
  cacheTTLSeconds: z.number().int().min(60).max(86400),
});

export async function GET() {
  // Ensure a singleton settings record exists
  const existing = await db.setting.findUnique({ where: { id: 1 } });
  const s = existing ?? (await db.setting.create({ data: { id: 1 } }));
  // Map stringified JSON fields to arrays for the client
  const locales = (() => {
    try {
      const value = (s as any).locales as unknown as string | null;
      return value ? (JSON.parse(value) as string[]) : ["tk", "ru", "en"];
    } catch {
      return ["tk", "ru", "en"];
    }
  })();
  const corsOrigins = (() => {
    try {
      const value = (s as any).corsOrigins as unknown as string | null;
      return value ? (JSON.parse(value) as string[]) : [];
    } catch {
      return [] as string[];
    }
  })();
  return Response.json({ ...s, locales, corsOrigins });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const parsed = SettingsSchema.parse(body);
  // Convert array fields into stringified JSON for SQLite columns
  const dataForDb: any = {
    ...parsed,
    locales: JSON.stringify(parsed.locales),
    corsOrigins: JSON.stringify(parsed.corsOrigins ?? []),
  };
  const s = await db.setting.update({ where: { id: 1 }, data: dataForDb });
  revalidateTag("settings");
  ["/", "/about", "/gallery", "/collaboration", "/sitemap.xml"].forEach(
    (p) => revalidatePath(p)
  );
  // Return normalized shape
  return Response.json({
    ...s,
    locales: parsed.locales,
    corsOrigins: parsed.corsOrigins ?? [],
  });
}
