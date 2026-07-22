"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { USER_SELECTION_PATH } from "@/components/selection/constants";

/** Legacy /app route — send signed-in users to the pipeline picker. */
export function HomeGate() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? USER_SELECTION_PATH : "/login");
  }, [loading, user, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#dbe8ff] text-black/60">
      {loading ? "Checking session…" : "Redirecting…"}
    </main>
  );
}
