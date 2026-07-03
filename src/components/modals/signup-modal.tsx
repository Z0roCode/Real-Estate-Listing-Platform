"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Home, Tag } from "lucide-react"
import { ModalShell } from "@/components/modals/modal-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const CITIES = ["Austin", "Denver", "Seattle", "Miami", "Nashville", "San Francisco", "Chicago", "Brooklyn", "Phoenix", "Portland", "New York", "Boulder"]
const BUDGETS = [
  { label: "Under $400K", value: 400000 },
  { label: "$400K – $700K", value: 700000 },
  { label: "$700K – $1M", value: 1000000 },
  { label: "$1M – $2M", value: 2000000 },
  { label: "$2M+", value: 3000000 },
]
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Just browsing"]

export function SignupModal() {
  const { active, close, signupContext, showToast } = useModal()
  const open = active === "signup"

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    intent: (signupContext.intent ?? "buying") as "buying" | "selling",
    budget: 700000, city: "Austin", timeline: "1–3 months",
  })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pendingSavePropertyId: signupContext.pendingSavePropertyId ?? null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not sign up")
      setDone(true)
      showToast(`Nice to meet you, ${form.firstName}`, "Your saved homes and appointments live in your dashboard.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign up")
    } finally {
      setLoading(false)
    }
  }

  const closeAndReset = () => { close(); setTimeout(() => { setDone(false); setError("") }, 250) }

  return (
    <ModalShell
      open={open}
      onClose={closeAndReset}
      size="lg"
      title={done ? undefined : signupContext.pendingSavePropertyId ? "Save this home" : "Tell us what you're looking for"}
      subtitle={done ? undefined : "It takes 30 seconds. We'll match you with the right agent and the right homes."}
    >
      {done ? (
        <div className="py-4 text-center">
          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </motion.span>
          <h3 className="mt-4 text-xl font-bold text-foreground">Nice to meet you, {form.firstName}.</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Your dashboard is ready. {signupContext.pendingSavePropertyId ? "We saved that home for you. " : ""}An agent will reach out within one business day about your {form.intent} goals.
          </p>
          <div className="mx-auto mt-5 max-w-sm space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What happens next</p>
            <p className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />We sent a confirmation to {form.email}</p>
            <p className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />An agent reviews your preferences and reaches out</p>
            <p className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Browse and save homes anytime in your dashboard</p>
          </div>
          <Button onClick={closeAndReset} className="mt-6">Start browsing</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* intent toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(["buying", "selling"] as const).map((it) => (
              <button key={it} onClick={() => setForm({ ...form, intent: it })}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-semibold capitalize transition-all ${form.intent === it ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}>
                {it === "buying" ? <Home className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
                I'm {it}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-sm font-medium">First name <span className="text-destructive">*</span></Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Jane" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Last name <span className="text-destructive">*</span></Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Email <span className="text-destructive">*</span></Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-0100" /></div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Preferred budget</Label>
              <select value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Preferred city</Label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Timeline</Label>
              <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={submit} disabled={loading || !form.firstName || !form.lastName || !form.email} className="w-full">
            {loading ? "Setting up…" : "Get started"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">No spam. We only use this to match you with homes and an agent.</p>
        </div>
      )}
    </ModalShell>
  )
}
