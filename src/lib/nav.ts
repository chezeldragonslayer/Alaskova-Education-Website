import { instagramUrl } from "@/lib/business";

export const primaryNav = [
  { href: "/molecular-atlas", label: "Molecular Atlas" },
  { href: "/modules", label: "Modules" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "Our mission" },
  { href: "/support", label: "Support" },
] as const;

export const footerNav = {
  Learn: [
    { href: "/molecular-atlas", label: "Molecular Atlas" },
    { href: "/modules#coming-soon", label: "Coming soon" },
    { href: "/pricing", label: "Pricing" },
  ],
  Alaskova: [
    { href: "/about", label: "Our mission" },
    { href: "/support", label: "Support centre" },
    { href: "/support#contact", label: "Contact us" },
    { href: instagramUrl, label: "Instagram" },
  ],
  Account: [
    { href: "/login", label: "Sign in" },
    { href: "/register", label: "Create account" },
    { href: "/dashboard", label: "My library" },
    { href: "/account", label: "My account" },
  ],
  Legal: [
    { href: "/legal/terms", label: "Terms of service" },
    { href: "/legal/privacy", label: "Privacy policy" },
    { href: "/legal/refunds", label: "Cancellation & refunds" },
  ],
} as const;
