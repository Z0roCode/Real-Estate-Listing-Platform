import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/** POST /api/track-view — increment view count from the card (debounced client-side). */
export async function POST(request: Request) {
  let body: { propertyId: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }
  if (!body.propertyId) return NextResponse.json({ ok: false })
  await db.property
    .update({ where: { id: body.propertyId }, data: { views: { increment: 1 } } })
    .catch(() => {})
  return NextResponse.json({ ok: true })
}
