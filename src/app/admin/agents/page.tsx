"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Home, TrendingUp } from "lucide-react"
import { AdminShell } from "@/components/layout/admin-shell"
import { Skeleton } from "@/components/ui/skeleton"
import type { Agent } from "@/lib/types"

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/agents").then((r) => r.json()).then((d) => { setAgents(d.agents ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <AdminShell title="Agents" subtitle="Your team's performance at a glance.">
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-muted">
                  <Image src={a.photo} alt={a.name} fill sizes="56px" className="object-cover" unoptimized />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.title}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="font-mono text-lg font-bold text-foreground">{a.soldCount}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sold</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="flex items-center justify-center gap-0.5 font-mono text-lg font-bold text-foreground"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{a.rating}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rating</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="truncate font-mono text-lg font-bold text-foreground">{a.city.slice(0, 3)}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">City</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {a.focusAreas.slice(0, 3).map((f) => <span key={f} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{f}</span>)}
              </div>
              <Link href={`/agents/${a.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">View profile →</Link>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
