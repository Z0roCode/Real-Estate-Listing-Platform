"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Eye, Calendar, MessageSquare, User, ArrowRight, LogIn, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { PropertyCard } from "@/components/property/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useModal } from "@/lib/modal-store"
import { prettyDate, prettyTime } from "@/lib/helpers"
import type { Property } from "@/lib/types"

interface DashData {
  user: { id: string; name: string; email: string; intent: string } | null
  saved: Property[]
  appointments: { id: string; date: string; time: string; type: string; status: string }[]
}

export default function DashboardPage() {
  const { openSignup, openBooking, savedIds } = useModal()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"saved" | "viewed" | "appointments">("saved")

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((d) => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  // recently viewed from localStorage
  const [recent, setRecent] = useState<Property[]>([])
  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem("zc_recent") || "[]")
    if (ids.length) {
      fetch("/api/properties").then((r) => r.json()).then((d) => {
        setRecent((d.properties ?? []).filter((p: Property) => ids.includes(p.id) && !data?.saved.find((s) => s.id === p.id)))
      })
    }
  }, [data?.saved])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 pb-20 lg:pb-0">
        <div className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {loading ? <Skeleton className="h-10 w-64" /> : data?.user ? (
              <>
                <p className="eyebrow">Your dashboard</p>
                <h1 className="text-h2 mt-2 text-foreground">Welcome back, {data.user.name.split(" ")[0]}.</h1>
                <p className="mt-1 text-sm text-muted-foreground">Your saved homes, appointments, and activity in one place.</p>
              </>
            ) : (
              <>
                <p className="eyebrow">Your dashboard</p>
                <h1 className="text-h2 mt-2 text-foreground">Sign in to see your saved homes.</h1>
                <p className="mt-1 text-sm text-muted-foreground">Track saved homes, viewings, and messages with your agent.</p>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}</div>
          ) : data?.user ? (
            <>
              {/* tabs */}
              <div className="mb-8 flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
                <TabBtn active={tab === "saved"} onClick={() => setTab("saved")} icon={Heart} label={`Saved (${data.saved.length})`} />
                <TabBtn active={tab === "viewed"} onClick={() => setTab("viewed")} icon={Eye} label={`Recently viewed (${recent.length})`} />
                <TabBtn active={tab === "appointments"} onClick={() => setTab("appointments")} icon={Calendar} label={`Appointments (${data.appointments.length})`} />
              </div>

              {tab === "saved" && (
                data.saved.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.saved.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
                  </div>
                ) : <EmptyTab icon={Heart} title="No saved homes yet" body="Tap the heart on any home to save it here." cta="Browse homes" href="/buy" />
              )}

              {tab === "viewed" && (
                recent.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recent.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
                  </div>
                ) : <EmptyTab icon={Eye} title="Nothing viewed yet" body="Homes you open will show up here for easy return." cta="Browse homes" href="/buy" />
              )}

              {tab === "appointments" && (
                data.appointments.length > 0 ? (
                  <div className="space-y-3">
                    {data.appointments.map((a) => (
                      <div key={a.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calendar className="h-5 w-5" /></span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{prettyDate(a.date)} at {prettyTime(a.time)}</p>
                            <p className="text-xs capitalize text-muted-foreground">{a.type} consultation · {a.status}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => openBooking()}>Reschedule</Button>
                      </div>
                    ))}
                  </div>
                ) : <EmptyTab icon={Calendar} title="No appointments yet" body="Book a free consultation with one of our agents." cta="Book a consultation" onClick={() => openBooking()} />
              )}
            </>
          ) : (
            /* not signed in */
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><User className="h-6 w-6" /></span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">Sign in to your dashboard</h2>
              <p className="mt-1 text-sm text-muted-foreground">Save homes, track appointments, and message your agent.</p>
              <div className="mt-5 space-y-2">
                <Button className="w-full gap-2" onClick={() => openSignup()}><Sparkles className="h-4 w-4" /> Sign up — it takes 30 seconds</Button>
                <Button variant="outline" className="w-full gap-2" asChild><Link href="/auth/sign-in"><LogIn className="h-4 w-4" /> Sign in</Link></Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Reviewing the demo? Use the sign-in page&apos;s &ldquo;explore as demo user&rdquo; button.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  )
}

function EmptyTab({ icon: Icon, title, body, cta, href, onClick }: { icon: any; title: string; body: string; cta: string; href?: string; onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground"><Icon className="h-7 w-7" /></span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {href && <Button asChild className="mt-5 gap-1.5"><Link href={href}>{cta} <ArrowRight className="h-4 w-4" /></Link></Button>}
      {onClick && <Button onClick={onClick} className="mt-5 gap-1.5">{cta} <ArrowRight className="h-4 w-4" /></Button>}
    </div>
  )
}
