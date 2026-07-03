"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Star, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { PropertyCard } from "@/components/property/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useModal } from "@/lib/modal-store"
import type { Agent, Property } from "@/lib/types"

export default function AgentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("")
  useEffect(() => { params.then((p) => setSlug(p.slug)) }, [params])
  if (!slug) return null
  return <Profile slug={slug} />
}

function Profile({ slug }: { slug: string }) {
  const router = useRouter()
  const { openBooking } = useModal()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [active, setActive] = useState<Property[]>([])
  const [sold, setSold] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/agents/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        setAgent(d.agent)
        setActive(d.active ?? [])
        setSold(d.sold ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="mt-6 grid gap-6 lg:grid-cols-3"><Skeleton className="h-96 lg:col-span-2" /><Skeleton className="h-96" /></div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold">Agent not found.</h1>
          <Button asChild className="mt-6"><Link href="/agents">See all agents</Link></Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* breadcrumb */}
        <div className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
            <Link href="/agents" className="hover:text-foreground">Agents</Link><span>/</span>
            <span className="truncate text-foreground">{agent.name}</span>
          </div>
        </div>

        {/* header */}
        <section className="border-b border-border/60 bg-background">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image src={agent.photo} alt={agent.name} fill sizes="192px" className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-h2 text-foreground">{agent.name}</h1>
                    <p className="mt-1 text-lg text-primary">{agent.title}</p>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{agent.specialty}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{agent.city}</span>
                      <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-primary" />{agent.rating} rating</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />{agent.soldCount}+ sold</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {agent.focusAreas.map((f) => (
                        <span key={f} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* contact card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <p className="text-sm font-semibold text-foreground">Work with {agent.name.split(" ")[0]}</p>
                <p className="mt-1 text-xs text-muted-foreground">Replies within one business day.</p>
                <div className="mt-4 space-y-2">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"><Phone className="h-4 w-4 text-primary" />{agent.phone}</a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"><Mail className="h-4 w-4 text-primary" />{agent.email}</a>
                </div>
                <Button className="mt-4 w-full gap-2" onClick={() => openBooking()}>Book a consultation</Button>
                <Button variant="outline" className="mt-2 w-full" asChild>
                  <a href={`mailto:${agent.email}?subject=Inquiry for ${agent.name}`}>Send a message</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* bio */}
        <section className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground">About {agent.name.split(" ")[0]}</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-foreground/80">{agent.bio}</p>
          </div>
        </section>

        {/* active listings */}
        {active.length > 0 && (
          <section className="border-b border-border/60 bg-background">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-foreground">Active listings ({active.length})</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              </div>
            </div>
          </section>
        )}

        {/* sold */}
        {sold.length > 0 && (
          <section className="border-b border-border/60 bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-foreground">Recently sold ({sold.length})</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sold.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              </div>
            </div>
          </section>
        )}

        {/* cta */}
        <section className="bg-foreground">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
            <h2 className="text-h2 text-background">Want to work with {agent.name.split(" ")[0]}?</h2>
            <p className="mx-auto mt-3 max-w-md text-background/70">Book a free consultation and see if it&apos;s a fit.</p>
            <Button size="lg" className="mt-6 gap-2" onClick={() => openBooking()}>Book a consultation <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
