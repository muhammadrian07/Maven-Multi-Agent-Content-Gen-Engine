import type {
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

type ClientAuthSuccess = {
  user: User;
};

type ClientAuthErrorBody = {
  error?: string;
};

async function postJson<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const body = data as ClientAuthErrorBody;
    const message =
      typeof body.error === "string" ? body.error : "Authentication failed.";
    throw new Error(message);
  }

  return data as T;
}

/**
 * Browser-facing auth helpers. Tokens stay in httpOnly cookies set by
 * Next.js Route Handlers — the UI only receives the user profile.
 */
export const authClient = {
  register(payload: RegisterPayload): Promise<ClientAuthSuccess> {
    return postJson<ClientAuthSuccess>("/api/auth/register", payload);
  },

  login(payload: LoginPayload): Promise<ClientAuthSuccess> {
    return postJson<ClientAuthSuccess>("/api/auth/login", payload);
  },

  google(payload: GoogleAuthPayload): Promise<ClientAuthSuccess> {
    return postJson<ClientAuthSuccess>("/api/auth/google", payload);
  },

  logout(): Promise<{ ok: true }> {
    return postJson<{ ok: true }>("/api/auth/logout");
  },

  async me(): Promise<User | null> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (response.status === 401) return null;

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as ClientAuthErrorBody;
      throw new Error(data.error ?? "Unable to load session.");
    }

    return (await response.json()) as User;
  },
};
