import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeProperty } from "@/lib/serialize"

/**
 * GET /api/properties/[slug]
 * Single property by slug, for the shareable detail page.
 * Also increments the view count (fire-and-forget) for the "view count" badge.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  let p
  try {
    p = await db.property.findUnique({
      where: { slug },
      include: { agent: true },
    })
  } catch {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  if (!p || !p.approved) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  // Increment views in the background (non-blocking)
  db.property
    .update({ where: { id: p.id }, data: { views: { increment: 1 } } })
    .catch(() => {})

  return NextResponse.json({ property: serializeProperty(p) })
}
