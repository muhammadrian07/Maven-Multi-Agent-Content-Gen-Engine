type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className="rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger"
      role="alert"
    >
      {message}
    </div>
  );
}
