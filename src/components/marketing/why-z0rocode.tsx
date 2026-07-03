"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList, Home, Handshake, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const VALUES = [
  { icon: ClipboardList, title: "Process you can see", body: "Four clear steps from first call to keys. You always know what is happening and what happens next." },
  { icon: Home, title: "Dual journey expertise", body: "We represent buyers and sellers with equal care. No side feels like an afterthought." },
  { icon: Handshake, title: "Concierge communication", body: "A dedicated agent who picks up. Weekly updates. No chasing, no guessing." },
  { icon: BarChart3, title: "Data-backed pricing", body: "We price with comps and context, not vibes. You see the numbers behind the number." },
]

const BUYING = [
  { step: "01", title: "Tell us what you want", body: "A 15-minute call to understand your budget, timeline, and the life you're moving toward." },
  { step: "02", title: "See the homes that fit", body: "We curate a shortlist, book tours, and flag things you'd miss." },
  { step: "03", title: "Make a strong offer", body: "We price the offer with data and negotiate hard on your behalf." },
  { step: "04", title: "Close and move in", body: "We handle inspections, paperwork, and deadlines. You get the keys." },
]
const SELLING = [
  { step: "01", title: "Get a clear valuation", body: "A real number based on comps, condition, and current demand." },
  { step: "02", title: "Prepare and list", body: "Pro photography, a floor plan, and a listing on every portal that matters." },
  { step: "03", title: "Market and negotiate", body: "Targeted campaigns, private showings, and skilled offer negotiation." },
  { step: "04", title: "Close and hand over", body: "Clean paperwork, a smooth escrow, and a check on time." },
]

export function WhyZ0roCode() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* left */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">Why Z0roCode</p>
            <h2 className="text-h2 mt-3 text-foreground">We sweat the details other agencies skip.</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Most agencies list a home and hope. We run a calm, transparent process that
              buyers and sellers actually understand. Here is what that looks like.
            </p>
            <Button variant="outline" asChild className="mt-6 gap-1.5">
              <a href="/about">See how it works <ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
          {/* right */}
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl border border-border/80 bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* how it works tabs */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="text-h2 mt-3 text-foreground">From first hello to front door.</h2>
            <p className="mt-3 text-[15px] text-muted-foreground">A simple path, whether you&apos;re buying or selling.</p>
          </div>
          <HowItWorks />
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [tab, setTab] = useState<"buying" | "selling">("buying")
  const steps = tab === "buying" ? BUYING : SELLING
  const { openBooking } = useModal()

  return (
    <div className="mt-10">
      <div className="mx-auto flex w-fit rounded-lg border border-border bg-muted/40 p-1">
        {(["buying", "selling"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-5 py-2 text-sm font-semibold capitalize transition-all ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative mt-10">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-border lg:block" />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-sm font-bold text-primary">
                  {s.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => openBooking()} className="gap-2">Book a consultation <ArrowRight className="h-4 w-4" /></Button>
        <Button variant="outline" asChild><a href="/about">See the full process</a></Button>
      </div>
    </div>
  )
}
