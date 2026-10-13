import { FlaskConical } from "lucide-react";
import clsx from "clsx";

export function DemoBadge({
  children = "Demo content",
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full bg-mist-2 px-2.5 py-1 text-xs font-medium text-steel ring-1 ring-line",
        className,
      )}
    >
      <FlaskConical size={12} aria-hidden />
      {children}
    </span>
  );
}
