import { NextResponse } from "next/server"
import { signupSchema } from "@/lib/validators"
import { rateLimit, getClientIp, badRequest, validationError, tooManyRequests, serverError } from "@/lib/api"
import { RATE_LIMITS } from "@/lib/config"
import { signupUser } from "@/lib/services"

/**
 * POST /api/signup
 * The onboarding modal. Validates → rate limits → delegates to the signup
 * service (which creates the user, lead, and notifications).
 *
 * Spam protection: honeypot field + per-IP rate limit.
 */
export async function POST(request: Request) {
  const rl = rateLimit({ key: `signup:${getClientIp(request)}`, ...RATE_LIMITS.signup })
  if (!rl.ok) return tooManyRequests(rl.resetAt)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest()
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)

  // Honeypot tripped — silently accept so bots don't retry
  if (parsed.data.website) return NextResponse.json({ ok: true })

  try {
    const user = await signupUser(parsed.data)

    // Set the session cookie
    const res = NextResponse.json({ ok: true, user })
    res.cookies.set("zc_session", user.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })
    return res
  } catch (error) {
    console.error("[signup]", error)
    return serverError()
  }
}
