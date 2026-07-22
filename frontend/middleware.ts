import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/constants";

const AUTH_PAGES = new Set(["/login", "/signup"]);
const PROTECTED_PAGES = new Set(["/app", "/user-selection"]);

/**
 * Soft gate only: cookie presence does not prove a valid session.
 * / is public landing; /user-selection is the post-login pipeline picker.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession =
    Boolean(request.cookies.get(ACCESS_COOKIE)?.value) ||
    Boolean(request.cookies.get(REFRESH_COOKIE)?.value);

  if (PROTECTED_PAGES.has(pathname) && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_PAGES.has(pathname) && hasSession) {
    const selectionUrl = request.nextUrl.clone();
    selectionUrl.pathname = "/user-selection";
    return NextResponse.redirect(selectionUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app", "/user-selection", "/login", "/signup"],
};
