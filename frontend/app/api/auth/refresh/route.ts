import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { djangoAuth } from "@/lib/api/auth";
import { applyAccessCookie, clearAuthCookiesOn } from "@/lib/auth/cookie-response";
import { readRefreshToken } from "@/lib/auth/cookies";
import { handleRouteError, jsonError } from "@/lib/auth/server";

export async function POST() {
  try {
    const refresh = readRefreshToken();
    if (!refresh) {
      const response = jsonError("No refresh token.", 401);
      clearAuthCookiesOn(response);
      return response;
    }

    const refreshed = await djangoAuth.refresh(refresh);
    const response = NextResponse.json({ ok: true });
    applyAccessCookie(response, refreshed.access);
    return response;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 400)) {
      const response = jsonError("Session expired. Please sign in again.", 401);
      clearAuthCookiesOn(response);
      return response;
    }
    return handleRouteError(error);
  }
}
