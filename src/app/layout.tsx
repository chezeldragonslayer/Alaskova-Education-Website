import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apex Education — Digital Textbooks, Simplified",
    template: "%s · Apex Education",
  },
  description:
    "Discover a simpler way to access your course textbooks. Search the catalogue, build your digital library and read online with Apex Education.",
  openGraph: {
    type: "website",
    siteName: "Apex Education",
    title: "Apex Education — All Your Textbooks. One Smarter Way to Study.",
    description:
      "A modern, technology-driven way to access and manage your course textbooks.",
    images: ["/brand/apex-logo-master.png"],
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
