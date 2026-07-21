import { NextResponse } from "next/server";
import { clearAuthCookiesOn } from "@/lib/auth/cookie-response";

export async function POST() {
  const response = NextResponse.json({ ok: true as const });
  clearAuthCookiesOn(response);
  return response;
}
