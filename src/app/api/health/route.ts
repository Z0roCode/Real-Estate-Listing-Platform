import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/health
 * Lightweight health check for uptime monitoring and deployment verification.
 * Checks database connectivity without exposing any schema details.
 *
 * Response:
 *   200 { ok: true, status: "healthy", database: "connected" }
 *   503 { ok: false, status: "degraded", database: "disconnected" }
 */
export async function GET() {
  const start = Date.now()

  let database: "connected" | "disconnected" = "disconnected"
  try {
    await db.$queryRaw`SELECT 1`
    database = "connected"
  } catch {
    // DB unavailable — report degraded but don't crash
  }

  const latencyMs = Date.now() - start
  const ok = database === "connected"

  return NextResponse.json(
    {
      ok,
      status: ok ? "healthy" : "degraded",
      database,
      latencyMs,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  )
}
