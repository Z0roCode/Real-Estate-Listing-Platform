"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, Mail, Phone, MapPin, DollarSign, GripVertical } from "lucide-react"
import { AdminShell } from "@/components/layout/admin-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, timeAgo } from "@/lib/helpers"
import { useModal } from "@/lib/modal-store"

const STAGES = [
  { id: "new", label: "New", color: "bg-blue-500" },
  { id: "contacted", label: "Contacted", color: "bg-amber-500" },
  { id: "consultation", label: "Consultation", color: "bg-purple-500" },
  { id: "client", label: "Client", color: "bg-primary" },
  { id: "won", label: "Won", color: "bg-emerald-500" },
  { id: "lost", label: "Lost", color: "bg-zinc-400" },
] as const

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  intent: string | null
  budget: number | null
  city: string | null
  timeline: string | null
  source: string
  stage: string
  notes: string | null
  createdAt: string
}

export default function AdminLeadsPage() {
  const { showToast } = useModal()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)

  const load = useCallback(() => {
    fetch("/api/admin/leads").then((r) => r.json()).then((d) => { setLeads(d.leads ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const moveStage = async (id: string, stage: string) => {
    const prev = leads
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)))
    showToast("Lead moved", `Now in ${stage}.`)
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      })
    } catch {
      setLeads(prev) // revert
    }
  }

  return (
    <AdminShell title="Leads" subtitle="Drag leads across stages to update your pipeline.">
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-6 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage.id)
            const value = stageLeads.reduce((s, l) => s + (l.budget ?? 0), 0)
            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-xl border border-border bg-card"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragId) moveStage(dragId, stage.id); setDragId(null) }}
              >
                <div className="flex items-center justify-between border-b border-border p-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                    <span className="text-sm font-semibold text-foreground">{stage.label}</span>
                    <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                  </div>
                </div>
                {value > 0 && <p className="px-3 pt-2 text-[11px] font-medium text-muted-foreground">{formatCurrency(value)} pipeline</p>}
                <div className="flex-1 space-y-2 p-2">
                  {stageLeads.map((l) => (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={() => setDragId(l.id)}
                      onDragEnd={() => setDragId(null)}
                      className={`cursor-grab rounded-lg border border-border/70 bg-background p-3 transition-shadow hover:shadow-sm ${dragId === l.id ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{l.name}</p>
                        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.email}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        {l.intent && <span className="rounded bg-muted px-1.5 py-0.5 capitalize">{l.intent}</span>}
                        {l.source && <span className="rounded bg-muted px-1.5 py-0.5 capitalize">{l.source}</span>}
                      </div>
                      {l.budget && <p className="mt-1.5 flex items-center gap-1 text-[11px] text-foreground/70"><DollarSign className="h-3 w-3" />{formatCurrency(l.budget)}</p>}
                      {l.city && <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" />{l.city}</p>}
                      <p className="mt-1.5 text-[10px] text-muted-foreground/70">{timeAgo(l.createdAt)}</p>
                    </div>
                  ))}
                  {stageLeads.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground/60">Drop here</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminShell>
  )
}
