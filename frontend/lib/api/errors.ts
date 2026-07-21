export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type DjangoErrorBody = {
  detail?: string;
  non_field_errors?: string[];
  email?: string[] | string;
  password?: string[] | string;
  full_name?: string[] | string;
  id_token?: string[] | string;
};

function firstMessage(value: string[] | string | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return undefined;
}

/** Normalize Django / DRF error payloads into a single user-facing message. */
export function messageFromDjangoBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;

  const data = body as DjangoErrorBody;

  if (typeof data.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  const nonField = firstMessage(data.non_field_errors);
  if (nonField) return nonField;

  return (
    firstMessage(data.email) ??
    firstMessage(data.password) ??
    firstMessage(data.full_name) ??
    firstMessage(data.id_token) ??
    fallback
  );
}

export async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    // Non-JSON bodies (HTML error pages, plain text) should not crash the client.
    return { detail: text.slice(0, 300) };
  }
}
