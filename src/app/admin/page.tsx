"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Eye, DollarSign, Clock, Building2, AlertCircle, ArrowRight, TrendingUp } from "lucide-react"
import { AdminShell } from "@/components/layout/admin-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, timeAgo } from "@/lib/helpers"

interface Stats {
  leads: number
  appointments: number
  totalViews: number
  revenue: number
  pending: number
  properties: number
  sources: { source: string; count: number }[]
  stages: { stage: string; count: number }[]
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/leads").then((r) => r.json()),
    ]).then(([s, l]) => {
      setStats(s)
      setLeads(l.leads ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <AdminShell title="Overview" subtitle="Your agency at a glance.">
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : stats ? (
        <>
          {/* stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total leads" value={String(stats.leads)} accent="primary" />
            <StatCard icon={Eye} label="Property views" value={stats.totalViews.toLocaleString()} accent="blue" />
            <StatCard icon={DollarSign} label="Closed sales value" value={formatCurrency(stats.revenue)} accent="green" />
            <StatCard icon={Clock} label="Upcoming calls" value={String(stats.appointments)} accent="amber" />
          </div>

          {/* pending alert */}
          {stats.pending > 0 && (
            <Link href="/admin/properties" className="mt-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-50 p-4 transition-colors hover:bg-amber-100 dark:bg-amber-950/20">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{stats.pending} listing{stats.pending === 1 ? "" : "s"} awaiting approval</p>
                <p className="text-xs text-muted-foreground">Review and publish seller-submitted properties.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* recent leads */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Recent leads</h2>
                <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline">View all</Link>
              </div>
              <div className="mt-4 space-y-2">
                {leads.slice(0, 6).map((l) => (
                  <div key={l.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{l.name.charAt(0)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{l.email} · {l.intent ?? "inquiry"}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">{l.stage}</span>
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{timeAgo(l.createdAt)}</span>
                  </div>
                ))}
                {leads.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No leads yet.</p>}
              </div>
            </div>

            {/* sources + stages */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-base font-semibold text-foreground">Lead sources</h2>
                <div className="mt-3 space-y-2">
                  {stats.sources.map((s) => {
                    const max = Math.max(...stats.sources.map((x) => x.count), 1)
                    return (
                      <div key={s.source}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize text-muted-foreground">{s.source}</span>
                          <span className="font-semibold text-foreground">{s.count}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(s.count / max) * 100}%` }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-base font-semibold text-foreground">Pipeline</h2>
                <div className="mt-3 space-y-2">
                  {stats.stages.map((s) => (
                    <div key={s.stage} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{s.stage}</span>
                      <span className="font-semibold text-foreground">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Could not load stats.</p>
      )}
    </AdminShell>
  )
}

const ACCENTS: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  blue: "bg-blue-500/10 text-blue-600",
  green: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${ACCENTS[accent]}`}><Icon className="h-5 w-5" /></span>
        <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <p className="mt-3 font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
