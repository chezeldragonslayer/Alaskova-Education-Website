import type { Metadata } from "next";
import { AuthCard } from "../AuthCard";
import { ForgotPasswordForm } from "../PasswordForms";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" intro="Enter the email you signed up with and we’ll send you a link to choose a new password.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
