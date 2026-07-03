import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/** GET /api/admin/leads — full lead board for the admin CRM. */
export async function GET() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({
    leads: leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      intent: l.intent,
      budget: l.budget,
      city: l.city,
      timeline: l.timeline,
      source: l.source,
      stage: l.stage,
      notes: l.notes,
      createdAt: l.createdAt.toISOString(),
    })),
  })
}
