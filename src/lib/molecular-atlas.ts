/**
 * Facts about Molecular Atlas used in the website copy.
 * Source: the Molecular Atlas repository (CURRICULUM.md, its search index, routes and interactive components),
 * read on 9 November 2026. Only list what the book actually contains. If the book changes, update this file.
 */
export const atlasFacts = {
  lessons: 229,
  modules: 10,
  /** 702 in the search index; written as "700+" in copy. */
  practiceProblems: "700+",
  /** 164 drug entries in the search index; written as "160+" in copy. */
  medicines: "160+",
  rules: 14,
} as const;

export const atlasModules: { n: number; title: string; lessons: number; summary: string }[] = [
  { n: 1, title: "Foundations", lessons: 18, summary: "Rebuilds general chemistry around where electrons are, not just how many." },
  { n: 2, title: "The Universal Rules", lessons: 22, summary: "The 14 rules that explain reactivity, practised one at a time." },
  { n: 3, title: "Organic Foundations", lessons: 18, summary: "Notation, naming and 3D reasoning, taught as a system rather than a list." },
  { n: 4, title: "Mechanisms", lessons: 28, summary: "Every mechanism derived from the rules before it is named." },
  { n: 5, title: "Functional Groups", lessons: 31, summary: "The groups a medicinal chemist meets, with the carbonyl as the master electrophile." },
  { n: 6, title: "Structure Determination", lessons: 21, summary: "Turning spectra into structures, one question per technique." },
  { n: 7, title: "Synthesis", lessons: 18, summary: "Planning molecules: retrosynthesis and the modern cross-coupling toolbox." },
  { n: 8, title: "Medicinal Chemistry", lessons: 32, summary: "Why does this drug have this structure? Chemistry applied to medicines." },
  { n: 9, title: "Drug Design", lessons: 26, summary: "How real discovery campaigns balance potency, safety and properties." },
  { n: 10, title: "Case Studies", lessons: 15, summary: "Real medicines analysed with the full toolkit, from problem to final structure." },
];

/** Questions the book really works through (see docs/REDESIGN-2026-11.md for where). */
export const atlasQuestions: { q: string; a: string; where: string }[] = [
  {
    q: "Does a \"sulfa allergy\" rule out celecoxib?",
    a: "Compare the sulfonamide in antibacterials like sulfamethoxazole with the one in celecoxib, and see why a recorded \"sulfa allergy\" is worth a question rather than an assumption.",
    where: "Functional groups: organosulfur chemistry",
  },
  {
    q: "What role can drug metabolism play in sulfamethoxazole-associated hypersensitivity?",
    a: "See why the arylamine on antibacterial sulfonamides matters, how it can be oxidised to a reactive metabolite, and which parts of the story remain unsettled.",
    where: "Functional groups: organosulfur chemistry",
  },
  {
    q: "How does molecular structure influence drug behaviour?",
    a: "Use the same 14 rules to reason about acidity, solubility, binding and metabolism, including where enzymes such as CYP2C9 attack a drug like celecoxib.",
    where: "Medicinal chemistry and drug design",
  },
];

/** Interactive tools that exist in the book (src/components/interactive in the Molecular Atlas repository). */
export const atlasTools = [
  "Step-through reaction mechanisms",
  "3D molecule viewer",
  "Spectrum interpreter",
  "pKa ladder",
  "Conformation wheel",
  "Energy-diagram explorer",
  "Structure drawer",
  "Structure–activity (SAR) explorer",
  "Reaction bench",
  "Electron-density explorer",
] as const;

/**
 * Real screenshots of Molecular Atlas for the website. OWNER: add 3 to 5 genuine screenshots to public/atlas/ and list
 * them here (never mock-ups). The screenshot section stays hidden while this list is empty.
 * Example: { src: "/atlas/mechanism.png", alt: "A reaction mechanism step in Molecular Atlas", width: 1600, height: 1000, caption: "Step through each mechanism" }
 */
export const atlasScreenshots: { src: string; alt: string; width: number; height: number; caption: string }[] = [];
