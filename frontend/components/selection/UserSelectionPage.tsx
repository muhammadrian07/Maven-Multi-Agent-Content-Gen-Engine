"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PipelineCard } from "@/components/selection/PipelineCard";
import { PIPELINE_CARDS } from "@/components/selection/constants";
import { Button } from "@/components/ui/Button";

/**
 * Authenticated pipeline picker.
 * Cards navigate to /maven-*-chatbot-ui for each pipeline.
 */
export function UserSelectionPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    // Warm chatbot routes so Select feels instant.
    PIPELINE_CARDS.forEach((card) => router.prefetch(card.href));
  }, [router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#dbe8ff] text-black/60">
        Loading…
      </main>
    );
  }

  return (
    <main className="selection-surface relative isolate min-h-dvh overflow-x-hidden">
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
          <div>
            <p className="text-sm font-medium text-black/55">maven.ai</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Choose a pipeline
            </h1>
            <p className="mt-1 max-w-xl text-sm text-black/65 sm:text-base">
              Welcome, {user.full_name || user.email}. Pick where you want to start.
            </p>
          </div>
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
        </header>

        <section
          aria-label="Pipeline options"
          className="grid flex-1 grid-cols-1 content-center gap-4 sm:gap-5 md:grid-cols-3 md:gap-6"
        >
          {PIPELINE_CARDS.map((card) => (
            <PipelineCard
              key={card.id}
              title={card.title}
              iconSrc={card.iconSrc}
              href={card.href}
              bullets={card.bullets}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
