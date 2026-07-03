import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

/**
 * PATCH /api/admin/leads/[id]
 * Move a lead between pipeline stages.
 */
const Schema = z.object({
  stage: z.enum(["new", "contacted", "consultation", "client", "won", "lost"]).optional(),
  notes: z.string().max(2000).optional().nullable(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 422 })
  }
  const data: any = {}
  if (parsed.data.stage !== undefined) data.stage = parsed.data.stage
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes

  const lead = await db.lead.update({ where: { id }, data })
  return NextResponse.json({ ok: true, lead: { id: lead.id, stage: lead.stage } })
}
