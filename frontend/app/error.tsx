"use client";

import { Button } from "@/components/ui/Button";

type AppErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Route-level recovery UI for unexpected render/runtime failures. */
export default function GlobalErrorBoundary({
  reset,
}: AppErrorBoundaryProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-3xl font-semibold text-ink">Maven</p>
        <h1 className="mt-4 text-xl text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink/65">
          An unexpected error occurred. You can try again, or return to sign in.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Sign in
          </Button>
        </div>
      </div>
    </main>
  );
}
