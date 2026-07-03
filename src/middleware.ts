import { NextRequest, NextResponse } from "next/server";

// This is a cheap, edge-level first line of defense: cookie-session
// (unsigned) sets a cookie literally named "session" containing the
// base64'd { jwt } payload (see backend src/app.ts). We can't verify
// the JWT signature here without pulling `jsonwebtoken` into the edge
// runtime, so we only check "is there a session cookie at all" and
// bounce straight to /login if not — saves a full render + a wasted
// backend round trip for the common case of a logged-out visitor
// hitting a protected URL directly.
//
// The AUTHORITATIVE check — does this cookie actually belong to a
// super_admin / recruiter / worker respectively — happens in each
// route group's layout.tsx via getCurrentUser(), which calls the real
// backend. This middleware is a UX/perf optimization, not the security
// boundary.
const PROTECTED_PREFIXES = ["/admin", "/recruiter", "/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasSession = req.cookies.has("session");
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/recruiter/:path*", "/dashboard/:path*"],
};
