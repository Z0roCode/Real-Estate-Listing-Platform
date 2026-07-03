import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/** GET /api/admin/appointments — all upcoming appointments for the calendar. */
export async function GET() {
  const rows = await db.appointment.findMany({
    orderBy: { date: "asc" },
  })
  return NextResponse.json({
    appointments: rows.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      date: a.date,
      time: a.time,
      type: a.type,
      status: a.status,
      notes: a.notes,
      createdAt: a.createdAt.toISOString(),
    })),
  })
}
