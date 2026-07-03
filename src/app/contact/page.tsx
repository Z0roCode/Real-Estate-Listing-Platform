"use client"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useModal } from "@/lib/modal-store"

const REASONS = ["I want to buy a home", "I want to sell my home", "I have a question", "I want to schedule a tour", "Something else"]

export default function ContactPage() {
  const { showToast } = useModal()
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: REASONS[0], message: "", website: "" })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.website) { setDone(true); return } // honeypot
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone || undefined,
          message: `${form.reason}: ${form.message}`, source: "contact",
          intent: form.reason.toLowerCase().includes("sell") ? "selling" : "buying",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not send")
      setDone(true)
      showToast("Message sent", "We'll respond within one business day.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send")
    } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
          <p className="eyebrow">Contact</p>
          <h1 className="text-display mt-3 text-foreground">Talk to a real person.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            No call centers, no bots. Send a message and an agent responds within one business day.
          </p>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* form */}
          <div className="lg:col-span-3">
            {done ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-7 w-7 text-primary" /></span>
                <h2 className="mt-4 text-xl font-bold text-foreground">Thanks, {form.name.split(" ")[0]}.</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">We got your message. An agent will respond within one business day. Check your email for a confirmation.</p>
                <Button variant="outline" className="mt-5" onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", reason: REASONS[0], message: "", website: "" }) }}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
                <h2 className="text-lg font-semibold text-foreground">Send us a message</h2>
                <div className="mt-5 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Full name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jane Doe" /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-medium">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-0100" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-medium">Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="jane@example.com" /></div>
                  <div className="space-y-1.5"><Label className="text-sm font-medium">What can we help with?</Label>
                    <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-medium">Message *</Label><Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required placeholder="Tell us a little about what you need…" /></div>
                  {/* honeypot */}
                  <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full gap-2 sm:w-auto">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send message</>}
                  </Button>
                  <p className="text-xs text-muted-foreground">We never share your information. This form is protected against spam.</p>
                </div>
              </form>
            )}
          </div>

          {/* contact info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-base font-semibold text-foreground">Reach us directly</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Phone className="h-4 w-4" /></span><div><p className="text-xs text-muted-foreground">Phone</p><a href="tel:+15125550100" className="font-medium text-foreground hover:text-primary">(512) 555-0100</a></div></li>
                <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Mail className="h-4 w-4" /></span><div><p className="text-xs text-muted-foreground">Email</p><a href="mailto:hello@z0rocode.com" className="font-medium text-foreground hover:text-primary">hello@z0rocode.com</a></div></li>
                <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><MapPin className="h-4 w-4" /></span><div><p className="text-xs text-muted-foreground">Office</p><p className="font-medium text-foreground">2200 Congress Ave, Austin, TX</p></div></li>
                <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock className="h-4 w-4" /></span><div><p className="text-xs text-muted-foreground">Hours</p><p className="font-medium text-foreground">Mon–Fri 9–6, Sat 10–4</p></div></li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe title="Office location" src="https://www.openstreetmap.org/export/embed.html?bbox=-97.7459%2C30.2669%2C-97.7359%2C30.2769&layer=mapnik" className="aspect-[4/3] w-full" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
