type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-ink text-cream hover:bg-ink/90 focus-visible:ring-ink/30 disabled:bg-ink/50",
  secondary:
    "border border-ink/15 bg-white/70 text-ink hover:bg-white focus-visible:ring-accent/30 disabled:opacity-60",
  ghost: "text-ink/70 hover:text-ink hover:bg-ink/5 focus-visible:ring-ink/20",
};

/**
 * Children are flex items (row + centered) so icons stay inline with labels.
 * Avoid wrapping icon+text in a block span — Tailwind makes SVGs display:block.
 */
export function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex h-9 flex-row items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed sm:h-10 ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : null}
      {loading ? <span>Please wait…</span> : children}
    </button>
  );
}
