import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserIdFromRequest } from "@/lib/auth"

/**
 * POST /api/save
 * Toggle a saved property for the signed-in user. If anonymous, returns 401 so
 * the client can open the signup modal (which then re-applies the save).
 *
 * The session cookie is verified (signed HMAC) — a tampered cookie is rejected.
 */
export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: "auth_required" }, { status: 401 })
  }
  let body: { propertyId: string; action?: "save" | "unsave" }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }
  if (!body.propertyId) {
    return NextResponse.json({ error: "propertyId required." }, { status: 422 })
  }

  const existing = await db.savedProperty.findUnique({
    where: { userId_propertyId: { userId, propertyId: body.propertyId } },
  })

  if (existing) {
    await db.savedProperty.delete({ where: { id: existing.id } })
    return NextResponse.json({ saved: false })
  }
  await db.savedProperty.create({
    data: { userId, propertyId: body.propertyId },
  })
  return NextResponse.json({ saved: true })
}
