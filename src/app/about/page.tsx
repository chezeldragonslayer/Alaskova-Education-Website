import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Apex Education publishes digital textbooks and makes them simple to access.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Apex Education" title={<>Making great textbooks <span className="gradient-text">simpler to reach.</span></>}>
        Apex Education publishes its own digital textbooks and builds the technology to read them anywhere.
      </PageHero>
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <h2 className="h2">Our purpose</h2>
          <p className="lead mt-4">Students shouldn’t have to hunt for the resources they need. We write textbooks and deliver them through a clean, modern platform so that access is simple, convenient and easy to manage.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="h2">What we do</h2>
          <p className="lead mt-4">Apex publishes digital textbooks, starting with <strong className="font-semibold text-midnight">Molecular Atlas</strong>, covering organic and pharmaceutical chemistry. Subscribers read online, keep their place, and manage their subscription from one account.</p>
        </Reveal>
        <Reveal className="rounded-2xl bg-mist p-8 ring-1 ring-line lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">About the author</h2>
          {/* TODO(owner): replace with your name, short bio and photo. */}
          <p className="mt-3 text-muted">Author biography to be added.</p>
        </Reveal>
        <div className="lg:col-span-2">
          <ButtonLink href="/catalogue" size="lg">Explore the textbook</ButtonLink>
        </div>
      </section>
    </>
  );
}
