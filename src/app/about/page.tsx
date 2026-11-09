import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Compass, Lightbulb, Microscope, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import { instagramUrl, business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Our mission",
  description:
    "Alaskova Education bridges university pharmacy education and real-world pharmaceutical science, industry practice, research and innovation.",
  alternates: { canonical: "/about" },
};

const pillars = [
  { icon: Microscope, t: "Deep scientific understanding", d: "The reasoning behind medicines, not lists to memorise." },
  { icon: Compass, t: "Industry-relevant education", d: "How medicines are discovered, developed, made and regulated." },
  { icon: Lightbulb, t: "Curiosity and critical thinking", d: "Asking better questions, and being honest about what is still unknown." },
  { icon: Users, t: "Student empowerment and innovation", d: "Giving students the confidence to contribute ideas, not just follow them." },
];

/** Long-term ambitions. NONE of these exists today; keep the label on this section. */
const vision = [
  "One-on-one mentoring",
  "A pharmacy education podcast and interviews with professionals",
  "Industry innovation workshops",
  "Partnerships with universities and pharmaceutical companies",
  "Structured student research projects",
  "Industry placements and mentorship programmes",
  "Alaskova Pharmaceuticals: a future teaching and innovation company",
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our mission" title={<>Built by a pharmacy student, <span className="gradient-text">for pharmacy students.</span></>}>
        Alaskova Education bridges the gap between university pharmacy education and real-world pharmaceutical science,
        industry practice, research and innovation.
      </PageHero>

      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:px-8 lg:py-24">
        <Reveal className="max-w-3xl">
          <h2 className="h2">Why we exist</h2>
          <p className="lead mt-4">
            Alaskova helps pharmacy students consolidate what they learn at university, understand the scientific reasoning
            behind medicines, explore opportunities beyond community and hospital pharmacy, and build the confidence to
            contribute to pharmaceutical innovation.
          </p>
          <p className="mt-5 font-display text-2xl font-bold leading-snug text-navy">
            We don’t just want students to understand today’s medicines. We want them to develop the knowledge and
            curiosity to improve tomorrow’s.
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, t, d }) => (
            <li key={t} className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <Icon className="text-gold-ink" size={22} aria-hidden />
              <h3 className="mt-3 font-display text-lg font-bold text-navy">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>

        <Reveal className="overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
          <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <Image
              src="/about/chelsea.jpg"
              alt="Chelsea, founder of Alaskova Education"
              width={880}
              height={1083}
              quality={90}
              sizes="(min-width: 768px) 420px, 100vw"
              className="h-96 w-full object-cover object-[50%_20%] md:h-full"
            />
            <div className="p-8 sm:p-10">
              <p className="eyebrow">Founder</p>
              <h2 className="h3 mt-2">Chelsea</h2>
              <p className="text-sm font-medium text-navy-soft">Intern Pharmacist · Founder of Alaskova Education</p>
              <div className="mt-5 space-y-4 text-navy">
                <p>
                  As a pharmacy student, I watched the door to the pharmaceutical industry feel closed. I also saw an
                  opportunity to ask better questions, challenge accepted limits, and open up parts of our profession that
                  are hidden while we study.
                </p>
                <p>
                  That belief became Alaskova: built by a pharmacy student, for pharmacy students. It starts with
                  expanding your education, and it&rsquo;s growing towards mentorship, connections beyond the classroom
                  and creating opportunities for students to explore, contribute and lead.
                </p>
                <p>
                  My ambition is to help shape a profession where ideas matter more than job titles, and where students
                  can turn curiosity into meaningful change. I want my ambition to give other people permission to be
                  ambitious.
                </p>
              </div>
              <a
                href={instagramUrl}
                rel="noopener noreferrer"
                className="mt-6 inline-flex font-semibold text-gold-ink underline underline-offset-4"
              >
                Follow @{business.instagram} on Instagram
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal className="rounded-2xl bg-white p-8 shadow-card ring-1 ring-gold/40 sm:p-10">
          <p className="eyebrow">What we offer today</p>
          <h2 className="h3 mt-2">Molecular Atlas</h2>
          <p className="mt-3 max-w-2xl text-muted">
            An interactive pharmaceutical organic chemistry textbook and workbook, and our only product today. It is a study
            resource, not an accredited course, and it isn’t affiliated with any university.
          </p>
          <ButtonLink href="/molecular-atlas" size="lg" className="mt-6">
            Explore Molecular Atlas <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        </Reveal>

        <Reveal className="on-dark rounded-2xl bg-navy p-8 text-white sm:p-10">
          <p className="eyebrow !text-gold">The future of Alaskova</p>
          <h2 className="h3 mt-2 text-white">Where we want to go</h2>
          <p className="mt-3 max-w-2xl text-white/85">
            Our long-term ambition is to connect pharmacy students, universities and pharmaceutical companies through
            education, mentorship, research projects, placements and student innovation.{" "}
            <strong className="text-white">These are plans, not current products or services.</strong>
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {vision.map((v) => (
              <li key={v} className="flex gap-3 text-white/90">
                <span aria-hidden className="text-gold">◆</span>
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/75">
            Follow{" "}
            <a href={instagramUrl} rel="noopener noreferrer" className="font-semibold text-white underline underline-offset-4">
              @{business.instagram}
            </a>{" "}
            to see each idea take shape.
          </p>
        </Reveal>

        <Reveal className="text-center">
          <p className="mx-auto font-display text-xl font-bold leading-snug text-navy sm:text-2xl">
            <span className="lg:block lg:whitespace-nowrap">Molecular Atlas is what we’re launching. Alaskova is what we’re building.</span>{" "}
            <span className="lg:block lg:whitespace-nowrap">Changing pharmaceutical innovation is why we’re doing it.</span>
          </p>
        </Reveal>
      </section>
    </>
  );
}
