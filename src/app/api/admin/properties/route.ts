import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeProperty } from "@/lib/serialize"

/**
 * GET /api/admin/properties
 * All properties for the admin table, including pending (unapproved) ones.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") // pending | approved | all
  const where: any = {}
  if (status === "pending") where.approved = false
  if (status === "approved") where.approved = true

  const rows = await db.property.findMany({
    where,
    include: { agent: true },
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
  })
  return NextResponse.json({ properties: rows.map(serializeProperty) })
}
