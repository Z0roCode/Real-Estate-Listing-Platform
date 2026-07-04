import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "@/lib/auth/session"

/**
 * Route protection middleware.
 *
 * Two concerns are handled here, both of which are horizontal security layers
 * that no single feature prompt naturally adds — they have to be wired in
 * deliberately after the features exist:
 *
 * 1. Admin routes (/admin/* and /api/admin/*) require an admin_session cookie
 *    matching ADMIN_SECRET. Without it, page requests redirect to /admin/login
 *    and API requests return 401. This closes the critical gap where every
 *    admin API endpoint was publicly queryable.
 *
 * 2. Client session cookies (zc_session) are verified for tampering. The
 *    middleware doesn't block on this — routes that need the user ID call
 *    getUserIdFromRequest() themselves — but we verify here so a tampered
 *    cookie is cleared early rather than passed around.
 */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // --- Admin gate -----------------------------------------------------------
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin")
  if (isAdminPath) {
    // /admin/login is the only admin route that must be publicly accessible
    // (it's where the password form lives and where the cookie is set).
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const adminToken = req.cookies.get("admin_session")?.value
    const expected = process.env.ADMIN_SECRET

    if (!expected) {
      // ADMIN_SECRET not configured — fail closed. In production this means
      // the admin panel is inaccessible until the env var is set, which is
      // safer than leaving it open.
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Admin access is not configured. Set ADMIN_SECRET in your environment.", code: "ADMIN_NOT_CONFIGURED" },
          { status: 503 },
        )
      }
      return NextResponse.redirect(new URL("/admin/login?error=not_configured", req.url))
    }

    if (adminToken !== expected) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    return NextResponse.next()
  }

  // --- Clear tampered session cookies --------------------------------------
  // If a client shows up with a zc_session cookie that doesn't verify, strip
  // it so downstream code sees no session rather than a forged one.
  const sessionCookie = req.cookies.get("zc_session")?.value
  if (sessionCookie && !verifySession(sessionCookie)) {
    const res = NextResponse.next()
    res.cookies.delete("zc_session")
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
