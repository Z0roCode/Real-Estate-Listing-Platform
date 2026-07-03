import { NextResponse } from "next/server"
import { leadSchema } from "@/lib/validators"
import { rateLimit, getClientIp, badRequest, validationError, tooManyRequests, serverError } from "@/lib/api"
import { RATE_LIMITS } from "@/lib/config"
import { captureLead } from "@/lib/services"

/**
 * POST /api/leads
 * Lightweight lead capture: newsletter signup, contact form, market note.
 * The lightest rung on the conversion ladder — often just an email.
 *
 * Spam protection: honeypot field + per-IP rate limit.
 */
export async function POST(request: Request) {
  const rl = rateLimit({ key: `leads:${getClientIp(request)}`, ...RATE_LIMITS.leads })
  if (!rl.ok) return tooManyRequests(rl.resetAt)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest()
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)

  // Honeypot tripped — silently accept so bots don't retry
  if (parsed.data.website) return NextResponse.json({ ok: true })

  try {
    const { id } = await captureLead(parsed.data)
    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (error) {
    console.error("[leads]", error)
    return serverError()
  }
}
