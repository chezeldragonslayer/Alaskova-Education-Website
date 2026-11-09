import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

const PUBLIC_PAGES = ["/", "/molecular-atlas", "/modules", "/pricing", "/about", "/support", "/legal/terms", "/legal/privacy", "/legal/refunds"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    ...PUBLIC_PAGES.map((p) => ({ url: `${base}${p === "/" ? "" : p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
  ];
}
