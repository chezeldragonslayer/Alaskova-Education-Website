"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BookMarked,
  Bookmark,
  Compass,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Library,
  Search,
  Settings,
  Activity,
} from "lucide-react";
import clsx from "clsx";
import { BookCover } from "./BookCover";
import { demoBooks } from "@/lib/demo";

const sidebar = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Library, label: "My Library" },
  { icon: Compass, label: "Explore" },
  { icon: Bookmark, label: "Saved" },
  { icon: Activity, label: "Activity" },
  { icon: CreditCard, label: "Subscription" },
  { icon: Settings, label: "Settings" },
  { icon: LifeBuoy, label: "Support" },
];

/** Built from the same card/progress primitives the real dashboard will use. */
export function DashboardMock({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState<Set<string>>(new Set(["d4"]));
  const reduce = useReducedMotion();
  const reading = demoBooks.filter((b) => b.progress !== undefined);

  const toggle = (id: string) =>
    setSaved((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-[1.25rem] bg-white shadow-lift ring-1 ring-midnight/10",
        className,
      )}
      role="group"
      aria-label="Interactive preview of the Alaskova Education student dashboard (demonstration content)"
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-mist px-4 py-3">
        <span className="size-2.5 rounded-full bg-midnight/15" />
        <span className="size-2.5 rounded-full bg-midnight/15" />
        <span className="size-2.5 rounded-full bg-midnight/15" />
        <div className="mx-auto hidden h-6 w-1/2 items-center justify-center rounded-md bg-white text-[0.7rem] text-muted ring-1 ring-line sm:flex">
          Alaskova Education · Dashboard
        </div>
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-medium text-steel ring-1 ring-line">
          Demo content
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[10.5rem_1fr]">
        <aside className="hidden bg-deep p-3 sm:block" aria-hidden>
          <ul className="space-y-0.5">
            {sidebar.map((s, i) => (
              <li key={s.label}>
                <button
                  tabIndex={-1}
                  onClick={() => setActive(i)}
                  className={clsx(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.78rem] font-medium transition-colors",
                    active === i
                      ? "bg-white/15 text-white"
                      : "text-white/65 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <s.icon size={15} />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-5 bg-mist/60 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold tracking-tight sm:text-lg">
                Welcome back, Alex
              </p>
              <p className="text-xs text-muted">Pick up where you left off.</p>
            </div>
            <div className="hidden h-9 w-44 items-center gap-2 rounded-lg bg-white px-3 text-xs text-muted ring-1 ring-line md:flex">
              <Search size={13} /> Search textbooks…
            </div>
          </div>

          {/* Continue reading */}
          <section aria-label="Continue reading">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-steel">
              Continue reading
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {reading.slice(0, 2).map((b, i) => (
                <div
                  key={b.id}
                  className="flex gap-3 rounded-xl bg-white p-3 shadow-card ring-1 ring-line"
                >
                  <BookCover book={b} compact className="w-14 shrink-0" />
                  <div className="min-w-0 flex-1 self-center">
                    <p className="truncate text-[0.8rem] font-semibold">{b.title}</p>
                    <p className="text-[0.7rem] text-muted">Chapter {i + 4}</p>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist-2"
                      role="progressbar"
                      aria-valuenow={b.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${b.title} reading progress`}
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-ocean to-bright"
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${b.progress}%` }}
                        transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <p className="mt-1 text-[0.65rem] font-medium text-steel">
                      {b.progress}% complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Library */}
          <section aria-label="My library">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-steel">
                My library
              </h3>
              <span className="flex items-center gap-1 text-[0.7rem] text-muted">
                <BookMarked size={12} /> {demoBooks.length} titles
              </span>
            </div>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {demoBooks.slice(0, 5).map((b, i) => (
                <motion.li
                  key={b.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                  className={clsx("group relative", i > 2 && "hidden sm:block", i > 3 && "sm:hidden lg:block")}
                >
                  <BookCover
                    book={b}
                    compact
                    className="transition-transform duration-300 group-hover:-translate-y-1"
                  />
                  <button
                    onClick={() => toggle(b.id)}
                    aria-pressed={saved.has(b.id)}
                    aria-label={`${saved.has(b.id) ? "Remove" : "Save"} ${b.title}`}
                    className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white/90 text-steel shadow-sm transition-transform hover:scale-110"
                  >
                    <Bookmark
                      size={12}
                      className={saved.has(b.id) ? "fill-ocean text-ocean" : ""}
                    />
                  </button>
                </motion.li>
              ))}
            </ul>
          </section>

          {/* Subscription */}
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-deep to-steel p-3.5 text-white">
            <div>
              <p className="text-[0.7rem] uppercase tracking-wider text-white/70">
                Subscription
              </p>
              <p className="text-sm font-semibold">Active · renews on your billing date</p>
            </div>
            <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold">
              Manage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
