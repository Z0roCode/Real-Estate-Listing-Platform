import { NextResponse } from "next/server"

/** POST /api/admin/logout — clear the admin session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return res
}
