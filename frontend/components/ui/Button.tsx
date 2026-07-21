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
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : null}
      <span>{loading ? "Please wait…" : children}</span>
    </button>
  );
}
