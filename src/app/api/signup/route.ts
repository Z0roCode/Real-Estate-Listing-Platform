import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { signSession } from "@/lib/auth"

/**
 * POST /api/signup
 * The onboarding modal. Creates (or finds) a User, creates a Lead, signs in
 * via a lightweight session cookie, creates a Notification (email stand-in),
 * and notifies admin. Returns the user so the client can reflect the session.
 */
const Schema = z.object({
  firstName: z.string().min(1, "First name is required.").max(60),
  lastName: z.string().min(1, "Last name is required.").max(60),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().max(40).optional().nullable(),
  intent: z.enum(["buying", "selling"]),
  budget: z.coerce.number().min(0).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  timeline: z.string().max(80).optional().nullable(),
  pendingSavePropertyId: z.string().optional().nullable(),
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
  const name = `${d.firstName} ${d.lastName}`.trim()

  // upsert user by email
  const user = await db.user.upsert({
    where: { email: d.email.toLowerCase() },
    update: {
      name,
      phone: d.phone ?? null,
      intent: d.intent,
      budget: d.budget ?? null,
      preferredCity: d.city ?? null,
      timeline: d.timeline ?? null,
      role: "client",
    },
    create: {
      email: d.email.toLowerCase(),
      name,
      phone: d.phone ?? null,
      role: "client",
      intent: d.intent,
      budget: d.budget ?? null,
      preferredCity: d.city ?? null,
      timeline: d.timeline ?? null,
    },
  })

  // create lead
  await db.lead.create({
    data: {
      userId: user.id,
      name,
      email: user.email,
      phone: d.phone ?? null,
      intent: d.intent,
      budget: d.budget ?? null,
      city: d.city ?? null,
      timeline: d.timeline ?? null,
      source: "signup",
      stage: "new",
    },
  })

  // apply a pending save if the signup came from "save this home"
  if (d.pendingSavePropertyId) {
    await db.savedProperty
      .upsert({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId: d.pendingSavePropertyId,
          },
        },
        update: {},
        create: { userId: user.id, propertyId: d.pendingSavePropertyId },
      })
      .catch(() => {})
  }

  // notification (email stand-in)
  await db.notification.create({
    data: {
      type: "email",
      recipient: user.email,
      subject: `Welcome to Z0roCode, ${d.firstName}`,
      body: `Thanks for joining. Your dashboard is ready. An agent will reach out within one business day about your ${d.intent} goals.`,
      refType: "lead",
      refId: user.id,
    },
  })
  await db.notification.create({
    data: {
      type: "internal",
      recipient: "admin@z0rocode.com",
      subject: `New ${d.intent} lead: ${name}`,
      body: `${name} (${d.email}) signed up. Budget ${d.budget ?? "n/a"}, city ${d.city ?? "n/a"}, timeline ${d.timeline ?? "n/a"}.`,
      refType: "lead",
      refId: user.id,
    },
  })

  // signed session cookie — the token is userId.hmac so it can't be tampered
  const res = NextResponse.json({ ok: true, user: { id: user.id, name, email: user.email } })
  res.cookies.set("zc_session", signSession(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })
  return res
}
