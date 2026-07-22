import { PageTextureBackground } from "@/components/ui/PageTextureBackground";

type AuthShellProps = {
  children: React.ReactNode;
};

/**
 * Compact auth viewport: keep the full form visible without page scroll
 * on typical laptop heights by tightening shell/card padding.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative isolate min-h-dvh overflow-x-hidden">
      <PageTextureBackground intensity="auth" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-4 py-3 sm:max-w-md sm:px-6 sm:py-4">
        <div className="auth-card rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-soft backdrop-blur-md sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
