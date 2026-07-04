import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeProperty } from "@/lib/serialize"
import { getUserIdFromRequest } from "@/lib/auth"

/**
 * GET /api/agent-dashboard
 * Returns the logged-in agent's listings, assigned leads, and pipeline value.
 * For the demo, treats the session user as a generic agent and returns all
 * agent-scoped data so the dashboard feels alive.
 *
 * Session cookie is verified (signed HMAC) before use.
 */
export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request)

  const agents = await db.agent.findMany({
    include: {
      properties: { where: { approved: true }, include: { agent: true } },
    },
  })

  // aggregate across all agents for the demo
  const allListings = agents.flatMap((a) => a.properties.map((p) => ({ ...serializeProperty(p), agentName: a.name })))
  const active = allListings.filter((p) => p.status === "For Sale")
  const pending = allListings.filter((p) => p.status === "Pending")
  const sold = allListings.filter((p) => p.status === "Sold")

  const leads = await db.lead.findMany({
    where: { stage: { in: ["new", "contacted", "consultation"] } },
    orderBy: { createdAt: "desc" },
  })

  const pipelineValue = active.reduce((s, p) => s + p.price, 0)
  const soldValue = sold.reduce((s, p) => s + p.price, 0)

  return NextResponse.json({
    agent: userId ? { id: userId } : null,
    stats: {
      active: active.length,
      pending: pending.length,
      sold: sold.length,
      pipelineValue,
      soldValue,
      newLeads: leads.filter((l) => l.stage === "new").length,
    },
    active,
    pending,
    sold,
    leads: leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      intent: l.intent,
      stage: l.stage,
      source: l.source,
      budget: l.budget,
      city: l.city,
      createdAt: l.createdAt.toISOString(),
    })),
  })
}
