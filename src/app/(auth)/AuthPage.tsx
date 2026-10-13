import { Suspense } from "react";
import { safeNext } from "@/lib/security";
import { LogoSymbol } from "@/components/Logo";
import { AuthForm } from "./AuthForm";

type SP = Promise<{ next?: string; book?: string; error?: string }>;

const errors: Record<string, string> = {
  callback: "That sign-in link didn't work. Please try again.",
  oauth: "We couldn't start that sign-in. Please try again.",
  "not-configured": "Sign-in isn't configured yet. The site owner needs to connect Supabase.",
};

async function Inner({ mode, searchParams }: { mode: "login" | "register"; searchParams: SP }) {
  const sp = await searchParams;
  // ?book=slug (from a textbook page) returns the student to that book after signing up.
  const next = sp.book && /^[a-z0-9-]+$/.test(sp.book)
    ? `/catalogue/${sp.book}`
    : safeNext(sp.next);
  return (
    <>
      {sp.error && (
        <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200">
          {errors[sp.error] ?? "Something went wrong. Please try again."}
        </p>
      )}
      <AuthForm mode={mode} next={next} />
    </>
  );
}

export function AuthPage({ mode, searchParams }: { mode: "login" | "register"; searchParams: SP }) {
  const isLogin = mode === "login";
  return (
    <section className="relative isolate grid min-h-[calc(100dvh-4.5rem)] place-items-center overflow-hidden px-5 py-12">
      <div aria-hidden className="aurora absolute inset-0 -z-10" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-7 shadow-lift ring-1 ring-line sm:p-9">
        <LogoSymbol size={56} />
        <h1 className="h3 mt-5 !text-[1.75rem]">{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1.5 mb-7 text-muted">
          {isLogin ? "Sign in to read your textbooks." : "It takes less than a minute."}
        </p>
        <Suspense fallback={<div className="skeleton h-80" aria-busy="true" />}>
          <Inner mode={mode} searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
