import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

/**
 * PATCH /api/admin/properties/[id]
 * Update a property's status (approve, feature, mark sold, etc.).
 */
const Schema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["For Sale", "Pending", "Sold"]).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten().fieldErrors }, { status: 422 })
  }
  const data: any = {}
  if (parsed.data.approved !== undefined) data.approved = parsed.data.approved
  if (parsed.data.featured !== undefined) data.featured = parsed.data.featured
  if (parsed.data.status !== undefined) data.status = parsed.data.status

  const property = await db.property.update({ where: { id }, data })
  return NextResponse.json({ ok: true, property: { id: property.id, slug: property.slug } })
}
