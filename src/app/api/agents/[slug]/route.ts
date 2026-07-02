import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeAgent, serializeProperty } from "@/lib/serialize"

/** GET /api/agents/[slug] — one agent + their active and sold listings. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const agent = await db.agent.findUnique({ where: { slug } })
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }
  const listings = await db.property.findMany({
    where: { agentId: agent.id, approved: true },
    include: { agent: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({
    agent: serializeAgent(agent),
    active: listings.filter((p) => p.status === "For Sale").map(serializeProperty),
    pending: listings.filter((p) => p.status === "Pending").map(serializeProperty),
    sold: listings.filter((p) => p.status === "Sold").map(serializeProperty),
  })
}
