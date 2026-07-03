import { NextResponse } from "next/server"
import { appointmentSchema } from "@/lib/validators"
import { rateLimit, getClientIp, badRequest, validationError, conflict, tooManyRequests, serverError } from "@/lib/api"
import { RATE_LIMITS } from "@/lib/config"
import { bookAppointment } from "@/lib/services"

/** Extract user ID from the session cookie (if signed in). */
function getUserId(request: Request): string | null {
  const cookie = request.headers.get("cookie") || ""
  const m = cookie.match(/zc_session=([^;]+)/)
  return m ? m[1] : null
}

/**
 * POST /api/appointments
 * Booking modal. Validates → rate limits → delegates to the booking service.
 * Returns 409 if the slot was just taken.
 */
export async function POST(request: Request) {
  const rl = rateLimit({ key: `appt:${getClientIp(request)}`, ...RATE_LIMITS.appointment })
  if (!rl.ok) return tooManyRequests(rl.resetAt)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest()
  }

  const parsed = appointmentSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)

  try {
    const result = await bookAppointment(parsed.data, getUserId(request))
    if (result.error === "conflict") {
      return conflict("That slot was just taken. Please pick another time.")
    }
    return NextResponse.json({ ok: true, id: result.id }, { status: 201 })
  } catch (error) {
    console.error("[appointments]", error)
    return serverError()
  }
}
