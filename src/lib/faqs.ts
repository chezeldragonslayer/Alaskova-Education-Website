import { atlasFacts } from "@/lib/molecular-atlas";

/** Questions shown on the homepage and the Molecular Atlas page. Keep answers true of the live product. */
export const atlasFaqs = [
  {
    q: "What is Molecular Atlas?",
    a: `An interactive pharmaceutical organic chemistry textbook and workbook: ${atlasFacts.lessons} lessons in ${atlasFacts.modules} modules, from the foundations of organic chemistry to medicinal chemistry, drug design and case studies of real medicines.`,
  },
  {
    q: "Who is it for?",
    a: "Pharmacy students studying organic or medicinal chemistry, and anyone who wants to understand the chemistry behind medicines. It isn’t affiliated with or endorsed by any university, so check your own unit outline for what you need to know.",
  },
  {
    q: "Is it an accredited course?",
    a: "No. Molecular Atlas is a study resource. It isn’t an accredited qualification, a university course or continuing professional development.",
  },
  {
    q: "How much does it cost?",
    a: "A$8.99 a month, including GST, billed monthly through Stripe. Cancel any time from your account and keep access until the end of the month you’ve paid for.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes. It works in your web browser on phones, tablets and computers. If you arrive from Instagram, open the page in your normal browser (Safari or Chrome) before you start.",
  },
  {
    q: "Does my progress save?",
    a: "Yes, automatically, in the browser you study in. Use the same device and browser to pick up where you left off.",
  },
  {
    q: "Are other modules available?",
    a: "Not yet. Molecular Atlas is the only module available today. Others are in planning; follow @alaskova on Instagram for release updates.",
  },
];
