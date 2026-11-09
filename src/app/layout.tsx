import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-serif/wdth.css";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alaskova Education — Built by a pharmacy student, for pharmacy students",
    template: "%s · Alaskova Education",
  },
  description:
    "Understand the science behind medicines. Molecular Atlas is an interactive pharmaceutical organic chemistry textbook for pharmacy students.",
  openGraph: {
    type: "website",
    siteName: "Alaskova Education",
    title: "Alaskova Education — Built by a pharmacy student, for pharmacy students",
    description:
      "Understand the science behind medicines. Go beyond the pharmacy curriculum with Molecular Atlas.",
    images: [{ url: "/brand/alaskova-social.png", width: 1200, height: 630, alt: "Alaskova Education" }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className="h-full">
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
