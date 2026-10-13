/**
 * DEMONSTRATION CONTENT ONLY.
 * No real titles, authors, publishers or availability. Replaced by catalogue
 * data from the database in Phase 2. Anything rendered from this file must be
 * labelled as demo content in the UI.
 */
export type DemoBook = {
  id: string;
  title: string;
  author: string;
  subject: string;
  edition?: string;
  status: "available" | "subscription" | "coming-soon";
  tone: 0 | 1 | 2 | 3 | 4;
  progress?: number;
};

export const demoBooks: DemoBook[] = [
  { id: "d1", title: "Molecular Atlas", author: "Apex Education", subject: "Chemistry", status: "available", tone: 1, progress: 62 },
  { id: "d2", title: "Introduction to Biology", author: "Sample Author", subject: "Life Sciences", edition: "5th ed.", status: "available", tone: 1, progress: 28 },
  { id: "d3", title: "Principles of Accounting", author: "Sample Author", subject: "Business", edition: "2nd ed.", status: "subscription", tone: 2 },
  { id: "d4", title: "Applied Statistics", author: "Sample Author", subject: "Mathematics", edition: "4th ed.", status: "available", tone: 3, progress: 81 },
  { id: "d5", title: "Modern Constitutional Law", author: "Sample Author", subject: "Law", edition: "1st ed.", status: "subscription", tone: 4 },
  { id: "d6", title: "Organic Chemistry Essentials", author: "Sample Author", subject: "Chemistry", edition: "6th ed.", status: "coming-soon", tone: 1 },
];

export const faqs = [
  {
    q: "What is Apex Education?",
    a: "Apex Education is a digital textbook subscription platform. Instead of buying a textbook outright, you subscribe monthly and read it online through a secure library.",
  },
  {
    q: "Which textbooks are available?",
    a: "Apex Education publishes its own digital textbooks. Every title page shows what the book covers and which subscription includes it, so you always know before you subscribe.",
  },
  {
    q: "How does the subscription work?",
    a: "You subscribe to a textbook for $11.99 per month, pay securely through Stripe, and your access is activated once payment is confirmed. Renewal dates, billing frequency and cancellation terms are shown clearly before checkout.",
  },
  {
    q: "Can I cancel at any time?",
    a: "You can manage or cancel your subscription from your account through the billing portal. The exact terms for each plan are shown on the pricing page.",
  },
  {
    q: "How do I read my textbooks?",
    a: "Open any title in your library and read it online in the Apex reader, with chapter navigation, bookmarks, adjustable text size and light and dark themes where supported.",
  },
  {
    q: "Is my data safe?",
    a: "Payments are handled by Stripe, so card details never touch Apex servers. Access to textbooks is checked on the server for every request.",
  },
];
