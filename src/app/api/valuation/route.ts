import { NextResponse } from "next/server"
import { valuationSchema } from "@/lib/validators"
import { rateLimit, getClientIp, badRequest, validationError, tooManyRequests, serverError } from "@/lib/api"
import { RATE_LIMITS } from "@/lib/config"
import { calculateValuation } from "@/lib/services"

/**
 * POST /api/valuation
 * Seller lead magnet. Validates → rate limits → delegates to the valuation
 * service (which computes the estimate from comps and stores the lead).
 */
export async function POST(request: Request) {
  const rl = rateLimit({ key: `valuation:${getClientIp(request)}`, ...RATE_LIMITS.valuation })
  if (!rl.ok) return tooManyRequests(rl.resetAt)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest()
  }

  const parsed = valuationSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)

  try {
    const estimate = await calculateValuation(parsed.data)
    return NextResponse.json({ ok: true, estimate }, { status: 201 })
  } catch (error) {
    console.error("[valuation]", error)
    return serverError()
  }
}
