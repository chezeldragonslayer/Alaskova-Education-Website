import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { instagramUrl, business } from "@/lib/business";

export const metadata: Metadata = {
  title: "About",
  description: "Alaskova Education publishes digital textbooks and makes them simple to access.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Alaskova Education" title={<>Making great textbooks <span className="gradient-text">simpler to reach.</span></>}>
        Alaskova Education publishes its own digital textbooks and builds the technology to read them anywhere.
      </PageHero>
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <h2 className="h2">Our purpose</h2>
          <p className="lead mt-4">Students shouldn’t have to hunt for the resources they need. We write textbooks and deliver them through a clean, modern platform so that access is simple, convenient and easy to manage.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="h2">What we do</h2>
          <p className="lead mt-4">Alaskova Education publishes digital textbooks, starting with <strong className="font-semibold text-navy">Molecular Atlas</strong>, an interactive pharmaceutical organic chemistry textbook. Subscribers read online, track their progress, and manage their subscription from one account.</p>
        </Reveal>
        <Reveal className="overflow-hidden rounded-2xl bg-paper ring-1 ring-line lg:col-span-2">
          <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <Image
              src="/about/chelsea.jpg"
              alt="Chelsea, founder of Alaskova Education"
              width={1600}
              height={1066}
              sizes="(min-width: 768px) 400px, 100vw"
              className="h-72 w-full object-cover object-[60%_35%] md:h-full"
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
        <div className="lg:col-span-2">
          <ButtonLink href="/catalogue" size="lg">Explore the textbook</ButtonLink>
        </div>
      </section>
    </>
  );
}
