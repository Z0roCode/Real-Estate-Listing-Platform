"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const ARTICLES = [
  { tag: "Market", title: "What $800K buys in Austin right now", excerpt: "A neighborhood-by-neighborhood tour of what your money gets in Austin this season.", read: "6 min read", date: "Jun 2026" },
  { tag: "Selling", title: "The 3 things that actually sell a home in 2025", excerpt: "Forget the fluff. These three moves move listings, and we have the data to prove it.", read: "5 min read", date: "May 2026" },
  { tag: "Finance", title: "Mortgage rates just moved. Here's what it means for you.", excerpt: "A plain-English breakdown of the latest rate change and how it shifts your monthly payment.", read: "4 min read", date: "May 2026" },
]

export function InsightsTeaser() {
  const { showToast } = useModal()
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) return
    await fetch("/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "insights", intent: "newsletter" }),
    }).catch(() => {})
    setDone(true); showToast("You're on the list", "Sunday market notes start this week.")
  }

  return (
    <section className="border-b border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Market insights</p>
            <h2 className="text-h2 mt-3 text-foreground">What&apos;s happening in your market.</h2>
          </div>
          <Link href="/insights" className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            Read all insights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href="/insights" className="group flex h-full flex-col rounded-xl border border-border/80 bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <span className="inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{a.tag}</span>
                <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.read}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* email capture */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:p-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Get the weekly market note.</h3>
            <p className="mt-1 text-sm text-muted-foreground">One email, every Sunday. No spam.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="gap-1.5">
              {done ? <><CheckCircle2 className="h-4 w-4" /> Subscribed</> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
