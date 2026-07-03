"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"
import type { Agent } from "@/lib/types"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/agents").then((r) => r.json()).then((d) => { setAgents(d.agents ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* hero */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
          <p className="eyebrow">Our team</p>
          <h1 className="text-display mt-3 text-foreground">Meet the people who&apos;ll get you home.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Real people with real specialties. Pick the agent who fits your move, or let us match you.
          </p>
        </div>
      </section>

      {/* grid */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border">
                  <Skeleton className="aspect-[4/5] w-full rounded-none" />
                  <div className="space-y-2 p-4"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                  <Link href={`/agents/${a.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      <Image src={a.photo} alt={a.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">{a.soldCount}+ sold</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{a.name}</h3>
                      <p className="text-sm text-muted-foreground">{a.title}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-primary">{a.specialty}</p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.city}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{a.phone}</span>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">View profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* values strip */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-h2 text-center text-foreground">How we work as a team.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "One standard", body: "Every agent meets the same bar for responsiveness, transparency, and results. No weak links." },
              { title: "Shared knowledge", body: "We meet weekly. What one agent learns about a neighborhood, the whole team uses." },
              { title: "Your agent, our bench", body: "You work with one person who knows your story, backed by a team when you need more." },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
