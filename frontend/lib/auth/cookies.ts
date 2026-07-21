import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/constants";

export function readAccessToken(): string | undefined {
  return cookies().get(ACCESS_COOKIE)?.value;
}

export function readRefreshToken(): string | undefined {
  return cookies().get(REFRESH_COOKIE)?.value;
}
