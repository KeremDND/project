"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) toast({ title: "Saved", description: "Settings updated." });
    else toast({ title: "Error", variant: "destructive" });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>

      <Tabs defaultValue="brand">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="brand">Brand & Theme</TabsTrigger>
          <TabsTrigger value="locales">Locales</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
          <TabsTrigger value="social">Social & Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <div className="space-y-3">
            <Input value={data.brandName || ""} onChange={(e) => setData({ ...data, brandName: e.target.value })} placeholder="Brand name" />
            <Input value={data.slogan || ""} onChange={(e) => setData({ ...data, slogan: e.target.value })} placeholder="Slogan" />
            <div className="grid grid-cols-2 gap-3">
              <Input value={data.primaryHex || "#0B6A43"} onChange={(e) => setData({ ...data, primaryHex: e.target.value })} placeholder="#0B6A43" />
              <Input value={data.accentHex || "#0E7A4C"} onChange={(e) => setData({ ...data, accentHex: e.target.value })} placeholder="#0E7A4C" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!data.lightMode} onCheckedChange={(v) => setData({ ...data, lightMode: v })} /> <span>Light mode</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locales">
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Enabled locales:</p>
              <div className="flex gap-4">
                {["tk", "ru", "en"].map((l) => {
                  const enabled: string[] = Array.isArray(data.locales) ? data.locales : ["tk", "ru", "en"];
                  const checked = enabled.includes(l);
                  return (
                    <label key={l} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? Array.from(new Set([...(enabled ?? []), l]))
                            : (enabled ?? []).filter((x: string) => x !== l);
                          let nextDefault = data.defaultLocale;
                          if (!next.includes(nextDefault)) nextDefault = next[0] ?? "tk";
                          setData({ ...data, locales: next, defaultLocale: nextDefault });
                        }}
                      />
                      {l.toUpperCase()}
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Default locale:</p>
              {["tk", "ru", "en"].map((l) => (
                <label key={l} className="flex items-center gap-2 mr-4">
                  <input type="radio" checked={data.defaultLocale === l} onChange={() => setData({ ...data, defaultLocale: l })} /> {l.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch checked={!!data.arEnabled} onCheckedChange={(v) => setData({ ...data, arEnabled: v })} /> <span>Enable AR/3D Viewer</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!data.aiBarEnabled} onCheckedChange={(v) => setData({ ...data, aiBarEnabled: v })} /> <span>Enable Abadan AI bar</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="space-y-3">
            <Input value={data.seoTitle || ""} onChange={(e) => setData({ ...data, seoTitle: e.target.value })} placeholder="Default SEO title" />
            <Input value={data.seoDescription || ""} onChange={(e) => setData({ ...data, seoDescription: e.target.value })} placeholder="Default SEO description" />
            <Input value={data.canonicalHost || ""} onChange={(e) => setData({ ...data, canonicalHost: e.target.value })} placeholder="Canonical host URL" />
            <Input value={data.ogImageUrl || ""} onChange={(e) => setData({ ...data, ogImageUrl: e.target.value })} placeholder="OG Image URL" />
            <Input value={data.twitterHandle || ""} onChange={(e) => setData({ ...data, twitterHandle: e.target.value })} placeholder="Twitter handle" />
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={data.phonePublic || ""} onChange={(e) => setData({ ...data, phonePublic: e.target.value })} placeholder="Phone" />
            <Input value={data.emailPublic || ""} onChange={(e) => setData({ ...data, emailPublic: e.target.value })} placeholder="Email" />
            <Input value={data.whatsappLink || ""} onChange={(e) => setData({ ...data, whatsappLink: e.target.value })} placeholder="WhatsApp link" />
            <Input value={data.telegramLink || ""} onChange={(e) => setData({ ...data, telegramLink: e.target.value })} placeholder="Telegram link" />
            <Input value={data.instagramLink || ""} onChange={(e) => setData({ ...data, instagramLink: e.target.value })} placeholder="Instagram" />
            <Input value={data.tiktokLink || ""} onChange={(e) => setData({ ...data, tiktokLink: e.target.value })} placeholder="TikTok" />
            <Input value={data.addressHQ || ""} onChange={(e) => setData({ ...data, addressHQ: e.target.value })} placeholder="HQ address" />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={data.gaId || ""} onChange={(e) => setData({ ...data, gaId: e.target.value })} placeholder="Google Analytics ID" />
            <Input value={data.gtmId || ""} onChange={(e) => setData({ ...data, gtmId: e.target.value })} placeholder="Google Tag Manager ID" />
            <Input value={data.metaPixelId || ""} onChange={(e) => setData({ ...data, metaPixelId: e.target.value })} placeholder="Meta Pixel ID" />
            <Input value={data.yandexMetrikaId || ""} onChange={(e) => setData({ ...data, yandexMetrikaId: e.target.value })} placeholder="Yandex Metrika ID" />
          </div>
        </TabsContent>

        <TabsContent value="email">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={data.smtpFromName || ""} onChange={(e) => setData({ ...data, smtpFromName: e.target.value })} placeholder="SMTP From Name" />
            <Input value={data.smtpFromEmail || ""} onChange={(e) => setData({ ...data, smtpFromEmail: e.target.value })} placeholder="SMTP From Email" />
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-3">
            <Input value={data.recaptchaSiteKey || ""} onChange={(e) => setData({ ...data, recaptchaSiteKey: e.target.value })} placeholder="reCAPTCHA Site Key" />
            <Input value={(data.corsOrigins?.join(", ") ?? "")} onChange={(e) => setData({ ...data, corsOrigins: e.target.value.split(",").map((s)=>s.trim()).filter(Boolean) })} placeholder="CORS Origins (comma-separated)" />
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-3">
            <Input value={String(data.cacheTTLSeconds ?? 600)} onChange={(e) => setData({ ...data, cacheTTLSeconds: Number(e.target.value || 0) })} placeholder="Cache TTL seconds" />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={save}>Save settings</Button>
    </div>
  );
}
