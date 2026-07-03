"use client"

import Link from "next/link"
import { Building2, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useModal } from "@/lib/modal-store"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const { showToast } = useModal()
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) return
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer", intent: "newsletter" }),
    }).catch(() => {})
    setDone(true)
    showToast("You're on the list", "Sunday market notes start this week.")
    setEmail("")
  }

  return (
    <footer id="about" className="mt-auto border-t border-border/70 bg-foreground text-background/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand + newsletter */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-[15px] font-bold tracking-tight text-background">
                Z0roCode <span className="text-primary">Estates</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              A modern real estate marketplace built for buyers and sellers who
              value transparency, great photography, and a frictionless search.
            </p>
            <form onSubmit={subscribe} className="mt-5 max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-background/50">
                Get the weekly market note
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 flex-1 rounded-lg border border-background/15 bg-background/5 px-3 text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {done ? "Subscribed" : "Subscribe"}
                  {!done && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>

          <FooterCol title="Explore" links={[
            { label: "Buy a home", href: "/buy" },
            { label: "Featured", href: "/buy?featured=1" },
            { label: "Luxury", href: "/buy?minPrice=1500000" },
            { label: "Open houses", href: "/buy" },
          ]} />
          <FooterCol title="Sell" links={[
            { label: "Get a valuation", href: "/sell/valuation" },
            { label: "List your property", href: "/sell" },
            { label: "How we sell", href: "/sell" },
            { label: "Selling process", href: "/sell" },
          ]} />
          <FooterCol title="Company" links={[
            { label: "About us", href: "/about" },
            { label: "Our agents", href: "/agents" },
            { label: "Insights", href: "/insights" },
            { label: "Contact", href: "/contact" },
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-background/60">
            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" />(512) 555-0100</span>
            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" />hello@z0rocode.com</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />Austin, TX · Nationwide</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-background/50">
            <Link href="/buy" className="hover:text-background">Privacy</Link>
            <Link href="/buy" className="hover:text-background">Terms</Link>
            <Link href="/buy" className="hover:text-background">Fair Housing</Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-background/40">
          © {year} Z0roCode Estates. A portfolio demo, not a real brokerage.
        </p>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-background/50">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition-colors hover:text-primary">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
