import type { Metadata } from "next";
import { AuthPage } from "../AuthPage";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; book?: string; error?: string }>;
}) {
  return <AuthPage mode="login" searchParams={searchParams} />;
}
