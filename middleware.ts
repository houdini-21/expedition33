import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [/^\/dashboard/, /^\/book/, /^\/bookings/, /^\/settings/];

const PUBLIC = [/^\/$/, /^\/login/, /^\/auth\/callback/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC.some((re) => re.test(pathname));
  const isProtected = PROTECTED.some((re) => re.test(pathname));

  const hasSession = Boolean(req.cookies.get("session")?.value);

  if (isProtected && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublic && hasSession && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/bookings";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
