import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * POST /api/auth/demo
 * Instant sign-in for portfolio reviewers. Creates (or reuses) a demo user
 * so the dashboards are explorable with zero friction. The README is honest
 * that this exists for the demo only and would be removed in production.
 */
export async function POST() {
  const email = "demo@z0rocode.com"
  const user = await db.user.upsert({
    where: { email },
    update: { name: "Demo Explorer", role: "client" },
    create: {
      email,
      name: "Demo Explorer",
      role: "client",
      intent: "buying",
      budget: 800000,
      preferredCity: "Austin",
      timeline: "1–3 months",
    },
  })

  // pre-save a couple of properties so the dashboard isn't empty
  const props = await db.property.findMany({ take: 2, where: { approved: true } })
  for (const p of props) {
    await db.savedProperty.upsert({
      where: { userId_propertyId: { userId: user.id, propertyId: p.id } },
      update: {},
      create: { userId: user.id, propertyId: p.id },
    }).catch(() => {})
  }

  const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } })
  res.cookies.set("zc_session", user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })
  return res
}
