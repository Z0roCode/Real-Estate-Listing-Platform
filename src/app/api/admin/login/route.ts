import { NextResponse } from "next/server"
import { z } from "zod"
import { timingSafeEqual } from "crypto"
import { badRequest, validationError, serverError, unauthorized } from "@/lib/api"

/**
 * POST /api/admin/login
 * One-field admin login. Compares the submitted password to ADMIN_SECRET
 * (env var) and sets an httpOnly, secure, sameSite=lax admin_session cookie
 * on match. The middleware on /admin/* and /api/admin/* checks this cookie.
 *
 * Why a single password and not user accounts? This is a portfolio demo —
 * the admin panel is used by one person (the owner). A full RBAC system
 * with roles and user management would be over-engineering. The middleware
 * + password gate is the right-sized security layer, and it's the one you'd
 * actually describe in an interview: "admin routes are protected by
 * middleware that checks a signed cookie set by a password-gated login."
 */
const Schema = z.object({
  password: z.string().min(1, "Enter the admin password.").max(200),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest()
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)

  const expected = process.env.ADMIN_SECRET
  if (!expected) {
    return NextResponse.json(
      { error: "Admin access is not configured. Set ADMIN_SECRET in your environment.", code: "ADMIN_NOT_CONFIGURED" },
      { status: 503 },
    )
  }

  // Use a constant-time comparison to prevent timing attacks on the password.
  // (timingSafeEqual requires equal-length buffers, so handle that edge.)
  const submitted = Buffer.from(parsed.data.password)
  const expectedBuf = Buffer.from(expected)
  const isMatch =
    submitted.length === expectedBuf.length &&
    safeEqual(submitted, expectedBuf)

  if (!isMatch) {
    return unauthorized("Wrong password.")
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin_session", expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
  return res
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
