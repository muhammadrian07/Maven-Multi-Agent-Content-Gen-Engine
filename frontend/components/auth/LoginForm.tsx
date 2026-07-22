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
import { hasErrors, validateLogin } from "@/lib/auth/validation";
import type { AuthFormErrors } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = useCallback(
    async (idToken: string) => {
      await loginWithGoogle({ id_token: idToken });
      router.replace("/app");
    },
    [loginWithGoogle, router],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setErrors({});

    try {
      await login({ email: email.trim(), password });
      router.replace("/app");
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Unable to sign in. Check your credentials.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <TextField
          id="login-email"
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
          id="login-password"
          name="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={submitting}
        />

        <FormError message={errors.form} />

        <Button type="submit" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>

      <AuthDivider />

      <GoogleAuthButton onCredential={handleGoogle} disabled={submitting} />

      <p className="text-center text-sm text-ink/65">
        New to Maven?{" "}
        <Link
          href="/signup"
          className="font-semibold text-ink underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
