"use client"

import Link from "next/link"
import { ArrowRight, Camera, TrendingUp, Megaphone, Handshake, Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"
import { StructuredData, faqSchema } from "@/lib/schema"

const STEPS = [
  { icon: TrendingUp, title: "Get a clear valuation", body: "A real number based on comps, condition, and current demand. Not a Zestimate, a conversation." },
  { icon: Camera, title: "Prepare and list", body: "Pro photography, a floor plan, and a listing on every portal that matters — within 48 hours." },
  { icon: Megaphone, title: "Market and negotiate", body: "Targeted campaigns, private showings, and skilled offer negotiation. We hold out for the right number." },
  { icon: Handshake, title: "Close and hand over", body: "Clean paperwork, a smooth escrow, and a check on time. You walk away with no loose ends." },
]

const INCLUDED = [
  "Professional photography and a measured floor plan",
  "Listing on the MLS, Zillow, Realtor.com, and our network",
  "A dedicated agent who picks up the phone",
  "Weekly written updates on showings and feedback",
  "Skilled negotiation on every offer",
  "Full transaction management through closing",
]

const FAQ = [
  { q: "How much does it cost to list with you?", a: "We work on a standard commission that's agreed upfront before listing. No hidden fees, no surprises at closing. We'll walk through the exact numbers during your valuation." },
  { q: "How long does it take to get listed?", a: "Once you sign the listing agreement, we schedule the photo shoot within 48 hours and your home goes live the same day the photos are delivered." },
  { q: "What if my home doesn't sell?", a: "If after 30 days of active marketing we haven't received an acceptable offer, we'll revisit the pricing strategy together. There's no penalty for taking it off the market." },
  { q: "Do I need to make repairs first?", a: "Not usually. We'll advise on which small fixes actually move the needle and which to skip. Most homes sell as-is with the right staging and pricing." },
  { q: "How do you price my home?", a: "We build a comparative market analysis using recent sales, current competition, and your home's condition. You see the full breakdown, not just a number." },
  { q: "Can I stay in the home while it's listed?", a: "Absolutely. Most sellers do. We'll coordinate showings around your schedule and give you a heads-up before every visit." },
]

export default function SellPage() {
  const { openListProperty, openBooking } = useModal()
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StructuredData data={faqSchema(FAQ.map((f) => ({ q: f.q, a: f.a })))} />
      <SiteHeader />

      {/* hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-foreground">
        <div className="absolute inset-0 opacity-30">
          <img src="https://sfile.chatglm.cn/images-ppt/931d33bb6e17.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">For sellers</p>
            <h1 className="text-display mt-3 text-background">Sell with confidence, not guesswork.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-background/75">
              See what your home is worth, learn exactly how we&apos;d sell it, and get a clear plan
              before you commit to anything. No pressure, no obligation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/sell/valuation">Get a free valuation <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="secondary" onClick={() => openListProperty()} className="gap-2">
                List your property
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* valuation teaser */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <p className="eyebrow">What&apos;s it worth</p>
            <h2 className="text-h2 mt-3 text-foreground">Find out what your home could sell for.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Tell us a few details and we&apos;ll send you a realistic estimate range based on recent
              sales near you. It takes two minutes and an agent follows up to refine it in person.
            </p>
            <Button size="lg" asChild className="mt-6 gap-2">
              <Link href="/sell/valuation">Start the valuation <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What you get</p>
            <ul className="mt-4 space-y-3">
              {["A realistic price range, not a wishful one", "Recent comparable sales in your area", "A clear plan to prepare your home for market", "A no-pressure call with a listing agent"].map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* how we sell */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How we sell</p>
            <h2 className="text-h2 mt-3 text-foreground">Four steps, zero mystery.</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-xl border border-border bg-card p-5 shadow-card">
                <span className="font-mono text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what you get */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <p className="eyebrow">What you get</p>
            <h2 className="text-h2 mt-3 text-foreground">Everything included, nothing hidden.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Every Z0roCode listing gets the full treatment. No tiers, no upsells.
            </p>
            <Button variant="outline" className="mt-6 gap-2" onClick={() => openBooking()}>
              Talk to a listing agent <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <ul className="grid gap-3">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm text-foreground/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* faq */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <p className="eyebrow">Seller questions</p>
            <h2 className="text-h2 mt-3 text-foreground">What sellers ask us.</h2>
          </div>
          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => <FaqRow key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="bg-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20 lg:px-8">
          <h2 className="text-h2 text-background">Ready to see what your home is worth?</h2>
          <p className="mx-auto mt-3 max-w-md text-background/70">Two minutes, no obligation, a real number.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="gap-2"><Link href="/sell/valuation">Get a free valuation <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button size="lg" variant="secondary" onClick={() => openBooking()} className="gap-2">Book a call</Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="text-[15px] font-semibold text-foreground">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  )
}
