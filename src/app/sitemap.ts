import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { catalogue } from "@/lib/catalogue";

const PUBLIC_PAGES = ["/", "/catalogue", "/how-it-works", "/pricing", "/about", "/support", "/legal/terms", "/legal/privacy", "/legal/refunds"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    ...PUBLIC_PAGES.map((p) => ({ url: `${base}${p === "/" ? "" : p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...catalogue.map((b) => ({ url: `${base}/catalogue/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
