/**
 * Public env access with clear failures when required values are missing.
 * Only NEXT_PUBLIC_* values belong here — secrets stay server-side.
 */

function readPublic(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getApiBaseUrl(): string {
  return readPublic("NEXT_PUBLIC_API_BASE_URL", "http://127.0.0.1:8000");
}

/** Empty string is allowed so the Google button can show a disabled help state. */
export function getGoogleClientId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
}
