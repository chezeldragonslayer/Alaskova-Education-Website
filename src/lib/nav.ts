export const primaryNav = [
  { href: "/catalogue", label: "Textbooks" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
] as const;

export const footerNav = {
  Product: [
    { href: "/catalogue", label: "Textbook catalogue" },
    { href: "/pricing", label: "Subscription plans" },
    { href: "/how-it-works", label: "How it works" },
  ],
  Company: [
    { href: "/about", label: "About Alaskova Education" },
    { href: "/support", label: "Support centre" },
    { href: "/support#contact", label: "Contact us" },
  ],
  Account: [
    { href: "/login", label: "Sign in" },
    { href: "/register", label: "Create account" },
    { href: "/dashboard", label: "Student dashboard" },
    { href: "/account", label: "My account" },
  ],
  Legal: [
    { href: "/legal/terms", label: "Terms of service" },
    { href: "/legal/privacy", label: "Privacy policy" },
    { href: "/legal/refunds", label: "Cancellation & refunds" },
  ],
} as const;
