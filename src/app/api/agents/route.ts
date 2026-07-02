import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeAgent } from "@/lib/serialize"

/** GET /api/agents — team list for /agents and homepage teaser. */
export async function GET() {
  try {
    const rows = await db.agent.findMany({
      orderBy: { soldCount: "desc" },
    })
    return NextResponse.json({ agents: rows.map(serializeAgent) })
  } catch {
    return NextResponse.json({ agents: [] })
  }
}
