"use client"

import Link from "next/link"
import { ArrowRight, Eye, Handshake, ShieldCheck, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const VALUES = [
  { icon: Eye, title: "Radical transparency", body: "You see the numbers, the process, and the trade-offs. No fine print, no surprises at closing." },
  { icon: Handshake, title: "Your goals first", body: "We turn down business when a deal isn't right for the client. That's not generosity, it's strategy." },
  { icon: ShieldCheck, title: "Details matter", body: "Deadlines, disclosures, inspections. We sweat the boring stuff so your sale doesn't fall apart in week four." },
  { icon: Sparkles, title: "Calm confidence", body: "Real estate is emotional. We bring steady judgment to the biggest decision most people ever make." },
]

export default function AboutPage() {
  const { openBooking } = useModal()
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* hero */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">About us</p>
            <h1 className="text-display mt-3 text-foreground">We&apos;re Z0roCode. We help people move well.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We started Z0roCode because real estate kept failing people. Slow agents, missing photos,
              buried details, broken promises. We believed a modern agency could be different — calm,
              transparent, and genuinely useful. So we built one.
            </p>
          </div>
        </div>
      </section>

      {/* story */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="text-h2 mt-3 text-foreground">Built on a simple idea.</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/80">
              <p>In 2014, our founder was helping a friend buy her first home. The agent never picked up. The listings had no real photos. The process felt designed to confuse her.</p>
              <p>That experience became a question: what if an agency treated buying and selling a home the way the best software companies treat their users? Clear, fast, honest, and built around the person, not the transaction.</p>
              <p>Twelve years later, we have helped over 1,200 families move. We have grown to ten cities. The tools have changed, but the idea has not. Treat people well, sweat the details, and the business takes care of itself.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src="https://sfile.chatglm.cn/images-ppt/121f2d37c8c2.jpg" alt="Our office" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* values */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">What we believe</p>
            <h2 className="text-h2 mt-3 text-foreground">Four things we won&apos;t compromise on.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><v.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how we work */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How we work</p>
            <h2 className="text-h2 mt-3 text-foreground">A process you can actually see.</h2>
            <p className="mt-3 text-[15px] text-muted-foreground">Whether you are buying or selling, the path is the same: clear steps, real updates, no mystery.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["A real conversation, not a script", "A plan written down and shared", "Weekly updates you can read in 60 seconds", "A clean close with no loose ends"].map((s, i) => (
              <div key={s} className="rounded-xl border border-border bg-card p-5">
                <span className="font-mono text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-sm font-medium text-foreground">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* team teaser */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div><p className="eyebrow">The team</p><h2 className="text-h2 mt-3 text-foreground">Meet the people behind the work.</h2></div>
            <Link href="/agents" className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex">Meet everyone <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { name: "Elena Vasquez", title: "Senior Buyer's Agent", photo: "https://sfile.chatglm.cn/images-ppt/888e2f600ce4.jpg" },
              { name: "Marcus Chen", title: "Luxury Specialist", photo: "https://sfile.chatglm.cn/images-ppt/b1dce3f9ed9b.jpg" },
              { name: "Priya Patel", title: "Listing Agent", photo: "https://sfile.chatglm.cn/images-ppt/27388b9df998.png" },
              { name: "James O'Brien", title: "First-Time Buyer Guide", photo: "https://sfile.chatglm.cn/images-ppt/51ff1eb439c0.jpg" },
            ].map((a) => (
              <Link key={a.name} href="/agents" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                  <img src={a.photo} alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="bg-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="text-h2 text-background">Let&apos;s talk about your move.</h2>
          <p className="mx-auto mt-3 max-w-md text-background/70">A 30-minute call. No pressure, no scripts.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openBooking()} className="gap-2">Book a consultation <ArrowRight className="h-4 w-4" /></Button>
            <Button size="lg" variant="secondary" asChild className="gap-2"><Link href="/contact">Contact us</Link></Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
