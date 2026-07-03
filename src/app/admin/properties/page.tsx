"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, X, Star, Eye, Clock, Building2 } from "lucide-react"
import { AdminShell } from "@/components/layout/admin-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"
import { formatCurrency, formatNumber } from "@/lib/helpers"
import type { Property } from "@/lib/types"

export default function AdminPropertiesPage() {
  const { showToast } = useModal()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")

  const load = useCallback(() => {
    const q = filter === "all" ? "" : `?status=${filter}`
    return fetch(`/api/admin/properties${q}`)
      .then((r) => r.json())
      .then((d) => { setProperties(d.properties ?? []) })
      .catch(() => {})
  }, [filter])

  useEffect(() => {
    let cancelled = false
    load().finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [load])

  const update = async (id: string, patch: { approved?: boolean; featured?: boolean; status?: "For Sale" | "Pending" | "Sold" }) => {
    try {
      await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (patch.approved !== undefined) showToast("Property approved", "It's now live on the site.")
      if (patch.featured !== undefined) showToast("Featured updated", "")
      if (patch.status !== undefined) showToast("Status updated", "")
      load()
    } catch { showToast("Update failed", "Please try again.") }
  }

  const filtered = properties.filter((p) => {
    if (filter === "pending") return !p.approved
    if (filter === "approved") return p.approved
    return true
  })

  return (
    <AdminShell title="Properties" subtitle="Manage listings and approve seller submissions.">
      {/* filter tabs */}
      <div className="mb-5 flex gap-1 rounded-lg border border-border bg-card p-1 w-fit">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-all ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {f} {f === "pending" && properties.filter((p) => !p.approved).length > 0 && `(${properties.filter((p) => !p.approved).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No {filter !== "all" ? filter : ""} properties.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={p.images[0]} alt={p.title} fill sizes="112px" className="object-cover" unoptimized />
                {!p.approved && <span className="absolute left-1 top-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">PENDING</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{p.title}</p>
                  {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />}
                </div>
                <p className="truncate text-xs text-muted-foreground">{p.address}, {p.city}, {p.state}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatCurrency(p.price)}</span>
                  <span>{p.bedrooms} bd · {p.bathrooms} ba · {formatNumber(p.sqft)} sqft</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.daysListed}d</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!p.approved ? (
                  <>
                    <Button size="sm" className="gap-1.5" onClick={() => update(p.id, { approved: true })}><Check className="h-3.5 w-3.5" /> Approve</Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => showToast("Rejected", "Property removed from queue.")}><X className="h-3.5 w-3.5" /> Reject</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant={p.featured ? "default" : "outline"} className="gap-1.5" onClick={() => update(p.id, { featured: !p.featured })}>
                      <Star className={`h-3.5 w-3.5 ${p.featured ? "fill-current" : ""}`} /> {p.featured ? "Featured" : "Feature"}
                    </Button>
                    <select
                      value={p.status}
                      onChange={(e) => update(p.id, { status: e.target.value as any })}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="For Sale">For Sale</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                    </select>
                    <Button size="sm" variant="ghost" asChild><Link href={`/buy/${p.slug}`}>View</Link></Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
