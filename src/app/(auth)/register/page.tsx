import type { Metadata } from "next";
import { AuthPage } from "../AuthPage";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; book?: string; error?: string }>;
}) {
  return <AuthPage mode="register" searchParams={searchParams} />;
}
