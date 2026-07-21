"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export function HomeGate() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-ink/60">
        Checking session…
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-ink/60">
        Redirecting to sign in…
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-auth-atmosphere" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
        <p className="font-display text-4xl font-semibold text-ink">Maven</p>
        <h1 className="mt-4 font-display text-2xl text-ink/90">
          You&apos;re signed in
        </h1>
        <p className="mt-2 text-ink/65">
          Welcome, {user.full_name || user.email}. Chat pipelines will live here
          once the Django agents API is connected.
        </p>
        <div className="mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </main>
  );
}
