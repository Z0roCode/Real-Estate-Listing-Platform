import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeProperty } from "@/lib/serialize"

/** GET /api/properties/featured — six featured for the homepage. */
export async function GET() {
  try {
    const rows = await db.property.findMany({
      where: { approved: true, featured: true, status: { not: "Sold" } },
      include: { agent: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    return NextResponse.json({ properties: rows.map(serializeProperty) })
  } catch {
    return NextResponse.json({ properties: [] })
  }
}
