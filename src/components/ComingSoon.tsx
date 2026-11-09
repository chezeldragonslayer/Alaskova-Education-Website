import {
  BookMarked,
  Briefcase,
  ClipboardCheck,
  Factory,
  FlaskConical,
  Landmark,
  Lightbulb,
  Microscope,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { plannedModules, type PlannedModule } from "@/lib/coming-soon";

const icons: Record<PlannedModule["icon"], LucideIcon> = {
  briefcase: Briefcase,
  factory: Factory,
  flask: FlaskConical,
  microscope: Microscope,
  clipboard: ClipboardCheck,
  landmark: Landmark,
  users: Users,
  shield: ShieldCheck,
  book: BookMarked,
  lightbulb: Lightbulb,
};

/** Text label (not colour alone), so the status is clear to everyone, including screen-reader users. */
export function ComingSoonLabel({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-paper-2 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-soft ring-1 ring-line",
        className,
      )}
    >
      Coming soon
    </span>
  );
}

function Card({ m, compact = false }: { m: PlannedModule; compact?: boolean }) {
  const Icon = icons[m.icon];
  return (
    <article className={clsx("flex h-full flex-col rounded-2xl bg-white ring-1 ring-line", compact ? "p-5" : "p-6")}>
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-ink">
          <Icon size={20} aria-hidden />
        </span>
        <ComingSoonLabel />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-navy">{m.title}</h3>
      <p className="mt-1.5 text-sm text-muted">{m.description}</p>
    </article>
  );
}

/** Featured cards, plus (optionally) the rest in an expandable list. Nothing here is for sale. */
export function ComingSoonGrid({ limit, showAll = true }: { limit?: number; showAll?: boolean }) {
  const featured = plannedModules.filter((m) => m.featured).slice(0, limit);
  const rest = plannedModules.filter((m) => !m.featured);
  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((m) => (
          <li key={m.slug}>
            <Card m={m} />
          </li>
        ))}
      </ul>
      {showAll && rest.length > 0 && (
        <details className="group mt-6 rounded-2xl bg-paper ring-1 ring-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-navy [&::-webkit-details-marker]:hidden">
            <span>{rest.length} more modules in planning</span>
            <span aria-hidden className="text-gold-ink transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
            {rest.map((m) => (
              <li key={m.slug}>
                <Card m={m} compact />
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
