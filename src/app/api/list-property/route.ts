import { NextResponse } from "next/server"
import { listPropertySchema } from "@/lib/validators"
import { rateLimit, getClientIp, badRequest, validationError, tooManyRequests, serverError } from "@/lib/api"
import { RATE_LIMITS } from "@/lib/config"
import { submitProperty } from "@/lib/services"

/**
 * POST /api/list-property
 * The "List your property" modal. Validates → rate limits (stricter, 3/hr) →
 * delegates to the property service (creates a pending property + lead).
 */
export async function POST(request: Request) {
  const rl = rateLimit({ key: `list:${getClientIp(request)}`, ...RATE_LIMITS.listProperty })
  if (!rl.ok) return tooManyRequests(rl.resetAt)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest()
  }

  const parsed = listPropertySchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)

  try {
    const { slug } = await submitProperty(parsed.data)
    return NextResponse.json({ ok: true, slug }, { status: 201 })
  } catch (error) {
    console.error("[list-property]", error)
    return serverError()
  }
}
