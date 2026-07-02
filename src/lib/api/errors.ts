import { NextResponse } from "next/server"

/**
 * Standardized API error responses.
 *
 * Every API route returns errors in a consistent shape so the frontend can
 * handle them predictably:
 *
 *   { error: "Human message", code: "ERROR_CODE", issues?: {...} }
 *
 * Status codes follow REST conventions:
 *   400 — bad input (malformed JSON)
 *   401 — not authenticated
 *   403 — not authorized
 *   404 — not found
 *   409 — conflict (e.g. double-booking)
 *   422 — validation failed (zod issues included)
 *   429 — rate limited
 *   500 — server error
 */

export function badRequest(message = "Invalid request body.") {
  return NextResponse.json({ error: message, code: "BAD_REQUEST" }, { status: 400 })
}

export function unauthorized(message = "Authentication required.") {
  return NextResponse.json({ error: message, code: "UNAUTHORIZED" }, { status: 401 })
}

export function forbidden(message = "You don't have access to this resource.") {
  return NextResponse.json({ error: message, code: "FORBIDDEN" }, { status: 403 })
}

export function notFound(message = "Resource not found.") {
  return NextResponse.json({ error: message, code: "NOT_FOUND" }, { status: 404 })
}

export function conflict(message: string) {
  return NextResponse.json({ error: message, code: "CONFLICT" }, { status: 409 })
}

export function validationError(issues: Record<string, string[] | undefined>) {
  return NextResponse.json(
    { error: "Validation failed.", code: "VALIDATION_ERROR", issues },
    { status: 422 },
  )
}

export function tooManyRequests(resetAt?: number) {
  return NextResponse.json(
    { error: "Too many requests. Please slow down.", code: "RATE_LIMITED", resetAt },
    { status: 429 },
  )
}

export function serverError(message = "Something went wrong on our end.") {
  return NextResponse.json({ error: message, code: "SERVER_ERROR" }, { status: 500 })
}

/**
 * Wrap an async route handler with consistent error handling.
 * Catches unexpected errors and returns a clean 500 instead of a crash.
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error("[api-error]", error)
      const message = error instanceof Error ? error.message : "Unexpected error"
      return serverError(message)
    }
  }) as T
}
