"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { Hero } from "@/components/marketing/hero"
import { TrustBar } from "@/components/marketing/trust-bar"
import { PropertyCard } from "@/components/property/card"
import { WhyZ0roCode } from "@/components/marketing/why-z0rocode"
import { Journeys } from "@/components/marketing/journeys"
import { AgentsTeaser } from "@/components/marketing/agents-teaser"
import { InsightsTeaser } from "@/components/marketing/insights-teaser"
import { Testimonials } from "@/components/marketing/testimonials"
import { FinalCTA } from "@/components/marketing/final-cta"
import { SiteFooter } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { StructuredData, agencySchema } from "@/lib/schema"
import type { Property, Agent } from "@/lib/types"

export default function Home() {
  const [featured, setFeatured] = useState<Property[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/properties/featured").then((r) => r.json()),
      fetch("/api/agents").then((r) => r.json()),
    ])
      .then(([f, a]) => {
        setFeatured(f.properties ?? [])
        setAgents(a.agents ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StructuredData data={agencySchema()} />
      <SiteHeader />

      <Hero listingCount={18} />

      <div id="main-content" />

      <TrustBar />

      {/* Featured listings */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Featured homes</p>
              <h2 className="text-h2 mt-3 text-foreground">A few homes we&apos;re proud to represent.</h2>
            </div>
            <Link href="/buy" className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex">
              View all homes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="space-y-3 p-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-full" /></div>
                  </div>
                ))
              : featured.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} featured={i === 0} />
                ))}
          </div>
          <Link href="/buy" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:hidden">
            View all homes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <WhyZ0roCode />

      <Journeys />

      <AgentsTeaser agents={agents} />

      <InsightsTeaser />

      <Testimonials />

      <FinalCTA />

      <SiteFooter />
    </div>
  )
}
