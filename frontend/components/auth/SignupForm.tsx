"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { hasErrors, validateSignup } from "@/lib/auth/validation";
import type { AuthFormErrors } from "@/types/auth";

export function SignupForm() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = useCallback(
    async (idToken: string) => {
      await loginWithGoogle({ id_token: idToken });
      router.replace("/");
    },
    [loginWithGoogle, router],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSignup({
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setErrors({});

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });
      router.replace("/");
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Unable to create your account.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <TextField
          id="signup-full-name"
          name="full_name"
          label="Full name"
          autoComplete="name"
          value={fullName}
          onChange={setFullName}
          error={errors.full_name}
          disabled={submitting}
        />
        <TextField
          id="signup-email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          disabled={submitting}
        />
        <PasswordField
          id="signup-password"
          name="password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={submitting}
        />
        <PasswordField
          id="signup-confirm-password"
          name="confirm_password"
          label="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirm_password}
          disabled={submitting}
        />

        <FormError message={errors.form} />

        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>

      <AuthDivider />

      <GoogleAuthButton onCredential={handleGoogle} disabled={submitting} />

      <p className="text-center text-sm text-ink/65">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-ink underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
