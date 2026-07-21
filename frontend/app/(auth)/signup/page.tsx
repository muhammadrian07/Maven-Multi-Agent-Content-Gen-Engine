import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for blog, YouTube, and UGC ad pipelines."
    >
      <SignupForm />
    </AuthShell>
  );
}
