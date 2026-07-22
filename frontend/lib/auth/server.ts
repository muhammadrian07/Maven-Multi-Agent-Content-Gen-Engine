import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import {
  applyAccessCookie,
  applyAuthCookies,
  clearAuthCookiesOn,
} from "@/lib/auth/cookie-response";
import { djangoAuth } from "@/lib/api/auth";
import { readAccessToken, readRefreshToken } from "@/lib/auth/cookies";
import type { AuthResponse, User } from "@/types/auth";

/**
 * Resolve a usable Django access token (refresh once if only refresh cookie exists).
 * Caller should attach `rotatedAccess` onto the response when present.
 */
export async function resolveAccessToken(): Promise<{
  accessToken: string | null;
  rotatedAccess?: string;
}> {
  const access = readAccessToken();
  const refresh = readRefreshToken();

  if (access) {
    return { accessToken: access };
  }

  if (!refresh) {
    return { accessToken: null };
  }

  try {
    const refreshed = await djangoAuth.refresh(refresh);
    return { accessToken: refreshed.access, rotatedAccess: refreshed.access };
  } catch {
    return { accessToken: null };
  }
}

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status || 502);
  }

  if (error instanceof Error) {
    return jsonError(error.message, 500);
  }

  return jsonError("Unexpected server error.", 500);
}

export function authSuccessResponse(auth: AuthResponse): NextResponse {
  const response = NextResponse.json({ user: auth.user });
  applyAuthCookies(response, auth.access, auth.refresh);
  return response;
}

/**
 * Try access cookie first; on 401, refresh once and retry /me.
 * Returns both the user and a response that may carry a rotated access cookie.
 */
export async function resolveSessionUser(): Promise<{
  user: User | null;
  response?: NextResponse;
}> {
  const access = readAccessToken();
  const refresh = readRefreshToken();

  if (!access && !refresh) {
    return { user: null };
  }

  if (access) {
    try {
      const user = await djangoAuth.me(access);
      return { user };
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }
    }
  }

  if (!refresh) {
    const response = NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    clearAuthCookiesOn(response);
    return { user: null, response };
  }

  try {
    const refreshed = await djangoAuth.refresh(refresh);
    const user = await djangoAuth.me(refreshed.access);
    const response = NextResponse.json(user);
    applyAccessCookie(response, refreshed.access);
    return { user, response };
  } catch {
    const response = NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    clearAuthCookiesOn(response);
    return { user: null, response };
  }
}
