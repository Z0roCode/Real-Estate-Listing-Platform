"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2, Users, DollarSign, TrendingUp, ArrowRight, Clock } from "lucide-react"
import { PropertyCard } from "@/components/property/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, timeAgo } from "@/lib/helpers"
import type { Property } from "@/lib/types"

interface AgentData {
  stats: { active: number; pending: number; sold: number; pipelineValue: number; soldValue: number; newLeads: number }
  active: Property[]
  pending: Property[]
  sold: Property[]
  leads: { id: string; name: string; email: string; intent: string | null; stage: string; source: string; budget: number | null; createdAt: string }[]
}

export default function AgentDashboardPage() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/agent-dashboard").then((r) => r.json()).then((d) => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
        <Skeleton className="mt-6 h-96 rounded-xl" />
      </div>
    )
  }

  if (!data) return <div className="p-6 text-sm text-muted-foreground">Could not load dashboard.</div>

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">Z</span>
          <div className="leading-none">
            <p className="text-sm font-bold text-foreground">Agent workspace</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Z0roCode Estates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild><Link href="/">Back to site</Link></Button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your listings, leads, and pipeline in one place.</p>

        {/* stat cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Building2} label="Active listings" value={String(data.stats.active)} />
          <StatCard icon={Users} label="Open leads" value={String(data.stats.newLeads)} />
          <StatCard icon={DollarSign} label="Pipeline value" value={formatCurrency(data.stats.pipelineValue)} />
          <StatCard icon={TrendingUp} label="Sold this year" value={String(data.stats.sold)} sub={formatCurrency(data.stats.soldValue)} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* my listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">My active listings</h2>
              <Link href="/admin/properties" className="text-sm font-medium text-primary hover:underline">Manage all</Link>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {data.active.slice(0, 4).map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              {data.active.length === 0 && <p className="text-sm text-muted-foreground">No active listings.</p>}
            </div>
          </div>

          {/* leads */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Open leads</h2>
              <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
            <div className="mt-4 space-y-2">
              {data.leads.slice(0, 6).map((l) => (
                <div key={l.id} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{l.name}</p>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">{l.stage}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.email}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    {l.intent && <span className="capitalize">{l.intent}</span>}
                    {l.budget && <span>· {formatCurrency(l.budget)}</span>}
                    <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{timeAgo(l.createdAt)}</span>
                  </div>
                </div>
              ))}
              {data.leads.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No open leads.</p>}
            </div>
            <Button className="mt-4 w-full gap-1.5" asChild>
              <Link href="/admin/leads">Open pipeline <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <p className="mt-3 font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  )
}
