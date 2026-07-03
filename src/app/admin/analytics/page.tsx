"use client"

import { useEffect, useState } from "react"
import { Users, Eye, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
import { AdminShell } from "@/components/layout/admin-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/helpers"

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

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  // mock traffic data for the chart (demo, clearly framed)
  const traffic = [
    { day: "Mon", visits: 1240 }, { day: "Tue", visits: 1580 }, { day: "Wed", visits: 1320 },
    { day: "Thu", visits: 1890 }, { day: "Fri", visits: 2240 }, { day: "Sat", visits: 1680 }, { day: "Sun", visits: 980 },
  ]
  const maxTraffic = Math.max(...traffic.map((t) => t.visits))
  const conversionRate = stats && stats.leads > 0 ? ((stats.leads / 8500) * 100).toFixed(1) : "0"

  return (
    <AdminShell title="Analytics" subtitle="Traffic, conversions, and lead performance.">
      {loading ? (
        <div className="space-y-4"><Skeleton className="h-28 rounded-xl" /><Skeleton className="h-72 rounded-xl" /></div>
      ) : stats ? (
        <>
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard icon={Users} label="Total leads" value={String(stats.leads)} sub="+12% this month" />
            <KpiCard icon={Eye} label="Property views" value={stats.totalViews.toLocaleString()} sub="+8% this week" />
            <KpiCard icon={TrendingUp} label="Conversion rate" value={`${conversionRate}%`} sub="leads / visitors" />
            <KpiCard icon={DollarSign} label="Closed sales" value={formatCurrency(stats.revenue)} sub={`${stats.properties} active`} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* traffic chart */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Weekly traffic</h2>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </div>
              <div className="mt-6 flex h-48 items-end justify-between gap-2">
                {traffic.map((t) => (
                  <div key={t.day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary" style={{ height: `${(t.visits / maxTraffic) * 100}%` }} title={`${t.visits} visits`} />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">{t.day}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Demo data for illustration. Connect an analytics provider for live numbers.</p>
            </div>

            {/* lead sources */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Lead sources</h2>
              <div className="mt-4 space-y-3">
                {stats.sources.length > 0 ? stats.sources.map((s) => {
                  const max = Math.max(...stats.sources.map((x) => x.count), 1)
                  return (
                    <div key={s.source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize text-foreground/80">{s.source}</span>
                        <span className="font-semibold text-foreground">{s.count}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(s.count / max) * 100}%` }} /></div>
                    </div>
                  )
                }) : <p className="text-sm text-muted-foreground">No leads yet.</p>}
              </div>
            </div>
          </div>

          {/* pipeline breakdown */}
          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Pipeline breakdown</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stats.stages.map((s) => (
                <div key={s.stage} className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="font-mono text-2xl font-bold text-foreground">{s.count}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{s.stage}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" /> Analytics are illustrative for this portfolio demo. Wire up Plausible, Fathom, or GA4 for production.
          </p>
        </>
      ) : <p className="text-sm text-muted-foreground">Could not load analytics.</p>}
    </AdminShell>
  )
}

function KpiCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
        <TrendingUp className="h-4 w-4 text-emerald-500" />
      </div>
      <p className="mt-3 font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[11px] text-emerald-600">{sub}</p>
    </div>
  )
}
