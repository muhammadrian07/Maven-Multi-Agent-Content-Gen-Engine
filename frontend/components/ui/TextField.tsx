type TextFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
};

export function TextField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  autoComplete,
  disabled,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink/80">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 rounded-lg border border-ink/15 bg-white/70 px-3 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
