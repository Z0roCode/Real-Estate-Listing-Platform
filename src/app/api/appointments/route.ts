import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserIdFromRequest } from "@/lib/auth"

/**
 * POST /api/appointments
 * Booking modal. Reserves a slot, creates a Lead, notifies admin and the
 * visitor. In the demo no real calendar invite is sent — the Notification
 * table stands in for the email/invite and the README says so.
 */
const Schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().min(7, "Enter a phone number.").max(40),
  date: z.string().min(8), // ISO date
  time: z.string().min(4),
  type: z.enum(["video", "phone", "office"]),
  propertyId: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }
  const d = parsed.data

  // simple anti-double-booking: check same date+time
  const clash = await db.appointment.findFirst({
    where: { date: d.date, time: d.time, status: "confirmed" },
  })
  if (clash) {
    return NextResponse.json(
      { error: "That slot was just taken. Please pick another time." },
      { status: 409 },
    )
  }

  // attach to a user if signed in (verified session)
  const userId = getUserIdFromRequest(request)

  const appt = await db.appointment.create({
    data: {
      userId: userId ?? null,
      propertyId: d.propertyId ?? null,
      name: d.name,
      email: d.email,
      phone: d.phone,
      date: d.date,
      time: d.time,
      type: d.type,
      notes: d.notes ?? null,
      status: "confirmed",
    },
  })

  await db.lead.create({
    data: {
      userId: userId ?? null,
      name: d.name,
      email: d.email,
      phone: d.phone,
      intent: "buying",
      source: "appointment",
      stage: "consultation",
      notes: `Booked ${d.type} consult ${d.date} ${d.time}`,
    },
  })

  await db.notification.create({
    data: {
      type: "email",
      recipient: d.email,
      subject: "Your consultation is booked",
      body: `Hi ${d.name}, you're booked for a ${d.type} consultation on ${d.date} at ${d.time}. We'll send a reminder the day before. Reply to this thread if you need to reschedule.`,
      refType: "appointment",
      refId: appt.id,
    },
  })
  await db.notification.create({
    data: {
      type: "internal",
      recipient: "admin@z0rocode.com",
      subject: `New consultation: ${d.name} — ${d.date} ${d.time}`,
      body: `${d.name} booked a ${d.type} consultation for ${d.date} at ${d.time}. Email ${d.email}, phone ${d.phone}.`,
      refType: "appointment",
      refId: appt.id,
    },
  })

  return NextResponse.json({ ok: true, id: appt.id }, { status: 201 })
}
