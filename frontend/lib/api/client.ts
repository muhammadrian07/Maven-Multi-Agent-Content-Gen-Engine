import { getApiBaseUrl } from "@/lib/env";
import { ApiError, messageFromDjangoBody, parseJsonSafe } from "@/lib/api/errors";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string | null;
  signal?: AbortSignal;
};

/**
 * Low-level Django API fetch. Used by server Route Handlers (BFF),
 * not directly by UI components.
 */
export async function djangoFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? (options.body !== undefined ? "POST" : "GET"),
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Unable to reach the API. Confirm Django is running and NEXT_PUBLIC_API_BASE_URL is correct.",
      0,
    );
  }

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new ApiError(
      messageFromDjangoBody(data, `Request failed (${response.status})`),
      response.status,
      data,
    );
  }

  return data as T;
}
