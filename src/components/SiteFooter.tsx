import Link from "next/link";
import { LogoHorizontal } from "./Logo";
import { footerNav } from "@/lib/nav";
import { business } from "@/lib/business";

export function SiteFooter() {
  return (
    <footer className="on-dark relative overflow-hidden border-t-2 border-gold bg-navy text-white">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          {/* The reversed logo has a solid navy (#0F1E3D) background, identical to the footer, so it sits seamlessly here. */}
          <LogoHorizontal variant="reversed" width={220} className="-ml-3" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
            A modern, technology-driven way to access and manage your course
            textbooks.
          </p>
          <p className="mt-6 text-sm text-white/70">
            Support:{" "}
            <Link href="/support" className="font-medium text-white underline underline-offset-4">
              Visit the support centre
            </Link>
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {Object.entries(footerNav).map(([group, links]) => (
            <div key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {group}
              </h2>
              <ul className="mt-4 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/60 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© Alaskova Education. All rights reserved.</p>
          {/* OWNER: fill these in src/lib/business.ts; placeholders show until then. */}
          <p>
            Alaskova Education is a trading name of {business.legalEntity} · ABN {business.abn}
          </p>
        </div>
      </div>
    </footer>
  );
}
