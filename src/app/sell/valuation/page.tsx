"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, CheckCircle2, TrendingUp, MapPin, Home, Ruler, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useModal } from "@/lib/modal-store"
import { formatCurrency } from "@/lib/helpers"

const STEPS = ["Address", "Details", "Condition", "Your details", "Result"]
const TYPES = ["House", "Apartment", "Condo", "Townhouse", "Loft"]
const CONDITIONS = [
  { id: "excellent", label: "Excellent", desc: "Move-in ready, recently updated" },
  { id: "good", label: "Good", desc: "Well maintained, minor updates needed" },
  { id: "fair", label: "Fair", desc: "Some updates needed" },
  { id: "needs-work", label: "Needs work", desc: "Significant updates needed" },
]
const CITIES = ["Austin", "Denver", "Seattle", "Miami", "Nashville", "San Francisco", "Chicago", "Brooklyn", "Phoenix", "Portland", "New York", "Boulder", "Glendale", "Savannah", "Plano", "Round Rock"]

export default function ValuationPage() {
  const { showToast } = useModal()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null)
  const [form, setForm] = useState({
    address: "", city: "Austin", type: "House", bedrooms: 3, bathrooms: 2, area: 1800,
    condition: "good" as string, timeline: "1–3 months",
    name: "", email: "", phone: "",
  })
  const update = (patch: Partial<typeof form>) => setForm({ ...form, ...patch })

  const submit = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/valuation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not get estimate")
      setEstimate(data.estimate)
      setStep(4)
      showToast("Estimate ready", "An agent will call to refine it in person.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not get estimate")
    } finally { setLoading(false) }
  }

  const canNext = [
    form.address.length > 4,
    form.area > 0,
    !!form.condition,
    form.name.length > 1 && form.email.includes("@") && form.phone.length > 6,
    true,
  ][step]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 pb-20 lg:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
          <Link href="/sell" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to selling
          </Link>

          {/* progress */}
          <div className="mb-8 flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-1.5">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className={`hidden text-xs font-medium sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {step < 4 && (
            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div className="space-y-4">
                  <Header icon={MapPin} title="Where is the property?" sub="Start with the address. We'll use it to pull nearby sales." />
                  <div className="space-y-1.5"><Label className="text-sm font-medium">Street address *</Label><Input value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="123 Main St, Austin, TX 78704" /></div>
                  <div className="space-y-1.5"><Label className="text-sm font-medium">City</Label>
                    <select value={form.city} onChange={(e) => update({ city: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <Header icon={Home} title="Tell us about the home" sub="The basics help us compare it to similar sales." />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Property type</Label>
                      <select value={form.type} onChange={(e) => update({ type: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={(e) => update({ bedrooms: Number(e.target.value) })} /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Bathrooms</Label><Input type="number" step="0.5" value={form.bathrooms} onChange={(e) => update({ bathrooms: Number(e.target.value) })} /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Area (sqft) *</Label><Input type="number" value={form.area} onChange={(e) => update({ area: Number(e.target.value) })} /></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <Header icon={Ruler} title="How's the condition?" sub="Be honest. It helps us give you a realistic number, not a wishful one." />
                  <div className="space-y-2">
                    {CONDITIONS.map((c) => (
                      <button key={c.id} onClick={() => update({ condition: c.id })} className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all ${form.condition === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div><p className="text-sm font-semibold text-foreground">{c.label}</p><p className="text-xs text-muted-foreground">{c.desc}</p></div>
                        {form.condition === c.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <Header icon={Calendar} title="Where should we send your estimate?" sub="We'll email the range and an agent calls within one business day to refine it." />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Your name *</Label><Input value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Jane Doe" /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Phone *</Label><Input value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(555) 555-0100" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-medium">Email *</Label><Input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} placeholder="jane@example.com" /></div>
                  <div className="space-y-1.5"><Label className="text-sm font-medium">Selling timeline</Label>
                    <select value={form.timeline} onChange={(e) => update({ timeline: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {["ASAP", "1–3 months", "3–6 months", "6+ months", "Just exploring"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              )}

              {/* nav */}
              <div className="mt-8 flex items-center justify-between">
                {step > 0 ? (
                  <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Back</button>
                ) : <span />}
                {step < 3 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext} className="gap-1.5">Continue <ChevronRight className="h-4 w-4" /></Button>
                ) : (
                  <Button onClick={submit} disabled={loading || !canNext} className="gap-2">
                    {loading ? "Calculating…" : <>Get my estimate <TrendingUp className="h-4 w-4" /></>}
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* result */}
          {step === 4 && estimate && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><TrendingUp className="h-7 w-7 text-primary" /></span>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your estimated home value</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {formatCurrency(estimate.low)} <span className="text-muted-foreground">–</span> {formatCurrency(estimate.high)}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
                Based on recent sales near {form.address.split(",")[0] || "you"}. This is a starting range — an in-person walkthrough
                refines it with your home&apos;s specific upgrades and condition.
              </p>

              <div className="mx-auto mt-8 max-w-md space-y-2 rounded-xl border border-border bg-muted/40 p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What affects this number</p>
                {["Recent sales within 0.5 miles", "Your home's square footage and lot", "Condition and recent upgrades", "Current market demand in " + form.city].map((x) => (
                  <p key={x} className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{x}</p>
                ))}
              </div>

              <div className="mx-auto mt-8 max-w-md space-y-3">
                <Button size="lg" className="w-full gap-2" onClick={() => { showToast("We'll be in touch", "A listing agent will call within one business day.") }}>
                  Talk to a listing agent
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/sell">Back to selling</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">This is an estimate for demonstration, not an appraisal or a guarantee of sale price.</p>
            </motion.div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function Header({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <div><h1 className="text-xl font-bold text-foreground">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{sub}</p></div>
    </div>
  )
}
