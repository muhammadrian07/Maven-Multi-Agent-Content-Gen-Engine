import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from "@/lib/auth/constants";

const isProd = process.env.NODE_ENV === "production";

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/** Attach auth cookies to a Route Handler response (preferred over cookies().set). */
export function applyAuthCookies(
  response: NextResponse,
  access: string,
  refresh: string,
): void {
  response.cookies.set(ACCESS_COOKIE, access, cookieOptions(ACCESS_MAX_AGE));
  response.cookies.set(REFRESH_COOKIE, refresh, cookieOptions(REFRESH_MAX_AGE));
}

export function applyAccessCookie(response: NextResponse, access: string): void {
  response.cookies.set(ACCESS_COOKIE, access, cookieOptions(ACCESS_MAX_AGE));
}

export function clearAuthCookiesOn(response: NextResponse): void {
  response.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
}
