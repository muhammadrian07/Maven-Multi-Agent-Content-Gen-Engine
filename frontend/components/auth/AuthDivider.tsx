type AuthDividerProps = {
  label?: string;
};

export function AuthDivider({ label = "or" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-ink/10" />
      <span className="text-xs font-medium uppercase tracking-wider text-ink/45">
        {label}
      </span>
      <div className="h-px flex-1 bg-ink/10" />
    </div>
  );
}
