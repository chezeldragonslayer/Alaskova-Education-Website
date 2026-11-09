/**
 * Planned modules. NONE of these is available: no prices, no checkout, no release dates.
 * Descriptions say what a module WILL cover. Move a module to the catalogue only when it can be bought and opened.
 */
export type PlannedModule = {
  slug: string;
  title: string;
  description: string;
  /** lucide-react icon name, mapped in the component. */
  icon:
    | "briefcase"
    | "factory"
    | "flask"
    | "microscope"
    | "clipboard"
    | "landmark"
    | "users"
    | "shield"
    | "book"
    | "lightbulb";
  featured: boolean;
};

export const plannedModules: PlannedModule[] = [
  {
    slug: "pharmaceutical-industry-careers",
    title: "Careers in the Pharmaceutical Industry",
    description: "Industry pathways and professional roles, with practical help on job applications and interviews.",
    icon: "briefcase",
    featured: true,
  },
  {
    slug: "gmp",
    title: "Good Manufacturing Practice (GMP)",
    description:
      "How medicines are made in Australia under the PIC/S Guide to GMP, with SOPs, documentation and compliance explained.",
    icon: "factory",
    featured: true,
  },
  {
    slug: "formulation-compounding",
    title: "Pharmaceutical Formulation & Compounding",
    description: "Dosage forms, excipients, stability and manufacture: the science of turning a molecule into a medicine.",
    icon: "flask",
    featured: true,
  },
  {
    slug: "research-development",
    title: "Research & Development / Medicinal Chemistry",
    description: "Drug discovery, lead optimisation, preclinical research and how products are developed.",
    icon: "microscope",
    featured: true,
  },
  {
    slug: "quality-assurance-control",
    title: "Quality Assurance & Quality Control",
    description: "Quality management systems, validation, deviations, CAPA and analytical testing in practice.",
    icon: "clipboard",
    featured: true,
  },
  {
    slug: "regulatory-affairs",
    title: "Regulatory Affairs in Australia",
    description: "The TGA, the ARTG and how therapeutic goods are regulated in Australia.",
    icon: "landmark",
    featured: true,
  },
  {
    slug: "clinical-trials-gcp",
    title: "Clinical Trials & Good Clinical Practice",
    description: "Clinical research and trial design, research ethics and protecting participant safety.",
    icon: "users",
    featured: false,
  },
  {
    slug: "pharmacovigilance",
    title: "Pharmacovigilance & Drug Safety",
    description: "Adverse-event monitoring, medicine safety and how benefit and risk are weighed.",
    icon: "shield",
    featured: false,
  },
  {
    slug: "industry-research-projects",
    title: "Pharmaceutical Industry Research Projects",
    description: "Literature reviews, developing a scientific project and research with an industry focus.",
    icon: "book",
    featured: false,
  },
  {
    slug: "entrepreneurship-innovation",
    title: "Pharmaceutical Entrepreneurship & Innovation",
    description: "Product development, patents, commercialisation and student-led innovation.",
    icon: "lightbulb",
    featured: false,
  },
];
