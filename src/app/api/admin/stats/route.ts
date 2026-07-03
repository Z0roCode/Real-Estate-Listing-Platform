import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/admin/stats
 * Overview numbers for the admin dashboard. Reads live from the DB so the demo
 * feels alive — every new lead/appointment shows up here.
 */
export async function GET() {
  const [leads, appointments, properties, sold] = await Promise.all([
    db.lead.count(),
    db.appointment.count({ where: { status: "confirmed" } }),
    db.property.findMany({
      where: { approved: true },
      select: { id: true, views: true, status: true, price: true },
    }),
    db.property.findMany({
      where: { status: "Sold" },
      select: { price: true },
    }),
  ])

  const totalViews = properties.reduce((s, p) => s + p.views, 0)
  const revenue = sold.reduce((s, p) => s + p.price, 0)
  const pending = await db.property.count({ where: { approved: false } })

  // lead sources breakdown
  const sourceRows = await db.lead.groupBy({ by: ["source"], _count: true })
  const sources = sourceRows.map((r) => ({ source: r.source, count: r._count }))

  // stage breakdown
  const stageRows = await db.lead.groupBy({ by: ["stage"], _count: true })
  const stages = stageRows.map((r) => ({ stage: r.stage, count: r._count }))

  return NextResponse.json({
    leads,
    appointments,
    totalViews,
    revenue,
    pending,
    properties: properties.length,
    sources,
    stages,
  })
}
