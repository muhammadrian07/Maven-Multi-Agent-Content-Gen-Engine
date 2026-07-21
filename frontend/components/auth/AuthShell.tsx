type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

/**
 * One composition for auth: brand-led hero copy + form column.
 * Intentionally not a dashboard chrome wrapper.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-auth-atmosphere"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-sea/25 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-12 sm:px-8">
        <div className="mb-8 animate-rise">
          <p className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Maven
          </p>
          <h1 className="mt-4 font-display text-2xl font-medium text-ink/90 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-md text-base text-ink/65">{subtitle}</p>
        </div>

        <div className="animate-rise-delayed rounded-2xl border border-ink/10 bg-cream/80 p-6 shadow-soft backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
