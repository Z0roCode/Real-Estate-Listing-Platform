"use client"

import { useEffect, useMemo, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { PropertyCard } from "@/components/property/card"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { Property, PropertyFilters } from "@/lib/types"

const DEFAULT_FILTERS: PropertyFilters = {
  q: "", city: "All", type: "All", status: "All",
  bedrooms: "All", minPrice: undefined, maxPrice: undefined,
  sort: "featured",
}

const PRICE_MIN = [{ label: "No min", value: "__none__" }, { label: "$250K", value: "250000" }, { label: "$500K", value: "500000" }, { label: "$750K", value: "750000" }, { label: "$1M", value: "1000000" }, { label: "$1.5M", value: "1500000" }, { label: "$2M", value: "2000000" }]
const PRICE_MAX = [{ label: "No max", value: "__none__" }, { label: "$500K", value: "500000" }, { label: "$750K", value: "750000" }, { label: "$1M", value: "1000000" }, { label: "$1.5M", value: "1500000" }, { label: "$2M", value: "2000000" }, { label: "$5M+", value: "5000000" }]
const BEDS = [{ label: "Any", value: "All" }, { label: "1+", value: "1" }, { label: "2+", value: "2" }, { label: "3+", value: "3" }, { label: "4+", value: "4" }, { label: "5+", value: "5" }]
const TYPES = ["All", "House", "Apartment", "Condo", "Townhouse", "Loft"]
const STATUSES = ["All", "For Sale", "Pending", "Sold"]
const SORTS = [{ label: "Featured", value: "featured" }, { label: "Newest", value: "newest" }, { label: "Price: low to high", value: "price-low" }, { label: "Price: high to low", value: "price-high" }]

export default function BuyPage() {
  // useSearchParams must be wrapped in Suspense for static prerendering (Vercel build).
  return (
    <Suspense fallback={<BuyFallback />}>
      <BuyPageContent />
    </Suspense>
  )
}

function BuyFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 w-72 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

function BuyPageContent() {
  const sp = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // initialize filters once from URL search params
  const [filters, setFilters] = useState<PropertyFilters>(() => {
    const f: PropertyFilters = { ...DEFAULT_FILTERS }
    if (sp.get("q")) f.q = sp.get("q")!
    if (sp.get("city")) f.city = sp.get("city")!
    if (sp.get("type")) f.type = sp.get("type") as any
    if (sp.get("minPrice")) f.minPrice = Number(sp.get("minPrice"))
    if (sp.get("sort")) f.sort = sp.get("sort") as any
    if (sp.get("featured")) f.sort = "featured"
    return f
  })

  useEffect(() => {
    let cancelled = false
    fetch("/api/properties?sort=" + (filters.sort ?? "featured"))
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setProperties(d.properties ?? []); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [filters.sort])

  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))).sort(), [properties])

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!`${p.title} ${p.address} ${p.city} ${p.state} ${p.features.join(" ")}`.toLowerCase().includes(q)) return false
      }
      if (filters.city !== "All" && p.city !== filters.city) return false
      if (filters.type !== "All" && p.type !== filters.type) return false
      if (filters.status !== "All" && p.status !== filters.status) return false
      if (filters.minPrice && p.price < filters.minPrice) return false
      if (filters.maxPrice && p.price > filters.maxPrice) return false
      if (filters.bedrooms !== "All" && p.bedrooms < Number(filters.bedrooms)) return false
      return true
    })
    if (filters.sort === "price-low") list = [...list].sort((a, b) => a.price - b.price)
    if (filters.sort === "price-high") list = [...list].sort((a, b) => b.price - a.price)
    if (filters.sort === "newest") list = [...list].sort((a, b) => a.daysListed - b.daysListed)
    if (filters.sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    return list
  }, [properties, filters])

  const update = useCallback((patch: Partial<PropertyFilters>) => setFilters((f) => ({ ...f, ...patch })), [])
  const hasActive = filters.q !== "" || filters.city !== "All" || filters.type !== "All" || filters.status !== "All" || filters.bedrooms !== "All" || !!filters.minPrice || !!filters.maxPrice

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow">Browse homes</p>
          <h1 className="text-h2 mt-2 text-foreground">Every home we represent, in one place.</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
            {loading ? "Loading listings…" : `${filtered.length} ${filtered.length === 1 ? "home" : "homes"} matching your search.`}
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={filters.q ?? ""} onChange={(e) => update({ q: e.target.value })} placeholder="Search by city, address, or keyword" className="h-10 pl-9" />
            </div>
            <Select value={filters.sort ?? "featured"} onValueChange={(v) => update({ sort: v as any })}>
              <SelectTrigger className="h-10 w-[170px] bg-background" size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>{SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-10 gap-1.5 lg:hidden" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>

          <div className="mt-3 hidden flex-wrap items-center gap-2 lg:flex">
            <Select value={(filters.minPrice ?? "__none__")} onValueChange={(v) => update({ minPrice: v === "__none__" ? undefined : Number(v) })}>
              <SelectTrigger className="h-9 w-[120px] bg-background" size="sm"><SelectValue placeholder="Min price" /></SelectTrigger>
              <SelectContent>{PRICE_MIN.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={(filters.maxPrice ?? "__none__")} onValueChange={(v) => update({ maxPrice: v === "__none__" ? undefined : Number(v) })}>
              <SelectTrigger className="h-9 w-[120px] bg-background" size="sm"><SelectValue placeholder="Max price" /></SelectTrigger>
              <SelectContent>{PRICE_MAX.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={(filters.bedrooms ?? "All") === "All" ? "__all__" : String(filters.bedrooms)} onValueChange={(v) => update({ bedrooms: v === "__all__" ? "All" : (Number(v) as any) })}>
              <SelectTrigger className="h-9 w-[110px] bg-background" size="sm"><SelectValue placeholder="Bedrooms" /></SelectTrigger>
              <SelectContent>{BEDS.map((s) => <SelectItem key={s.value} value={s.value === "All" ? "__all__" : s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.type ?? "All"} onValueChange={(v) => update({ type: v as any })}>
              <SelectTrigger className="h-9 w-[130px] bg-background" size="sm"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All types" : t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.city ?? "All"} onValueChange={(v) => update({ city: v })}>
              <SelectTrigger className="h-9 w-[140px] bg-background" size="sm"><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent><SelectItem value="All">All locations</SelectItem>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.status ?? "All"} onValueChange={(v) => update({ status: v as any })}>
              <SelectTrigger className="h-9 w-[120px] bg-background" size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "Any status" : s}</SelectItem>)}</SelectContent>
            </Select>
            {hasActive && (
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })}>
                <X className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
            <span className="ml-auto text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "result" : "results"}</span>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="border-b border-border bg-background lg:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 sm:px-6">
            <MobileSelect label="Min price" value={(filters.minPrice ?? "__none__")} opts={PRICE_MIN} onChange={(v) => update({ minPrice: v === "__none__" ? undefined : Number(v) })} />
            <MobileSelect label="Max price" value={(filters.maxPrice ?? "__none__")} opts={PRICE_MAX} onChange={(v) => update({ maxPrice: v === "__none__" ? undefined : Number(v) })} />
            <MobileSelect label="Bedrooms" value={(filters.bedrooms ?? "All") === "All" ? "__all__" : String(filters.bedrooms)} opts={BEDS.map((b) => ({ label: b.label, value: b.value === "All" ? "__all__" : b.value }))} onChange={(v) => update({ bedrooms: v === "__all__" ? "All" : (Number(v) as any) })} />
            <MobileSelect label="Type" value={filters.type ?? "All"} opts={TYPES.map((t) => ({ label: t === "All" ? "All types" : t, value: t }))} onChange={(v) => update({ type: v as any })} />
            <MobileSelect label="Location" value={filters.city ?? "All"} opts={[{ label: "All locations", value: "All" }, ...cities.map((c) => ({ label: c, value: c }))]} onChange={(v) => update({ city: v })} />
            <MobileSelect label="Status" value={filters.status ?? "All"} opts={STATUSES.map((s) => ({ label: s === "All" ? "Any status" : s, value: s }))} onChange={(v) => update({ status: v as any })} />
          </div>
        </div>
      )}

      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-full" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground"><MapPin className="h-7 w-7" /></span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">No homes match your search</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try widening your price range or removing a filter.</p>
              <Button variant="outline" size="sm" className="mt-5" onClick={() => setFilters(DEFAULT_FILTERS)}>Reset filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} featured={i === 0 && p.featured} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function MobileSelect({ label, value, opts, onChange }: { label: string; value: string; opts: { label: string; value: string }[]; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
