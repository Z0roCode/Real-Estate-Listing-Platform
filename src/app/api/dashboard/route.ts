import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeProperty } from "@/lib/serialize"

/** GET /api/dashboard — client dashboard data for the signed-in user. */
export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || ""
  const m = cookie.match(/zc_session=([^;]+)/)
  const userId = m ? m[1] : null
  if (!userId) {
    return NextResponse.json({ user: null })
  }
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ user: null })

  const saved = await db.savedProperty.findMany({
    where: { userId },
    include: { property: { include: { agent: true } } },
    orderBy: { createdAt: "desc" },
  })
  const appointments = await db.appointment.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  })

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, intent: user.intent },
    saved: saved.map((s) => s.property).filter(Boolean).map(serializeProperty),
    appointments: appointments.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      type: a.type,
      status: a.status,
    })),
  })
}
