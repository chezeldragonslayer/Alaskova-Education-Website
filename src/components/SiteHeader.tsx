"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { HomeLink } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { primaryNav } from "@/lib/nav";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "glass border-b border-line shadow-[0_8px_24px_-16px_rgb(3_32_72/0.25)]"
          : "border-b border-transparent bg-white/0",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <HomeLink />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "relative rounded-lg px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                      active ? "text-midnight" : "text-steel hover:text-midnight",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-ocean" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/dashboard" variant="ghost" prefetch={false}>
            My library
          </ButtonLink>
          <ButtonLink href="/login" variant="ghost">
            Sign in
          </ButtonLink>
          <ButtonLink href="/register">Get started</ButtonLink>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl text-midnight ring-1 ring-line lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4.5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-white lg:hidden"
          >
            <nav aria-label="Mobile" className="flex h-full flex-col px-5 pb-8 pt-4 sm:px-8">
              <ul className="flex flex-col">
                {primaryNav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-4 font-display text-xl font-semibold text-midnight"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3 pt-8">
                <ButtonLink href="/register" size="lg" onClick={() => setOpen(false)}>
                  Get started
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary" size="lg" onClick={() => setOpen(false)}>
                  Sign in
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="ghost" size="lg" prefetch={false} onClick={() => setOpen(false)}>
                  My library
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
