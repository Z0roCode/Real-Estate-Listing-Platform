import { NextResponse } from "next/server"

/**
 * Standardized success responses — the counterpart to `./errors.ts`.
 *
 * Every API response (success or error) now follows a predictable shape,
 * making the frontend's fetch handlers simple and consistent.
 */

export function ok<T>(data: T, status: 200 | 201 = 200) {
  return NextResponse.json({ ok: true, ...data }, { status })
}

export function created<T>(data: T) {
  return NextResponse.json({ ok: true, ...data }, { status: 201 })
}

/** No-content success (for deletes, toggles that don't return data). */
export function noContent() {
  return new NextResponse(null, { status: 204 })
}
