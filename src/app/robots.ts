import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/** Public pages may be crawled; private and functional routes may not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/healthz", "/dashboard", "/account", "/read/", "/api/", "/auth/", "/r/", "/reset-password", "/library"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
