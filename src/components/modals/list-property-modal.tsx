"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ChevronLeft, ChevronRight, Upload, X, Home } from "lucide-react"
import { ModalShell } from "@/components/modals/modal-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const TYPES = ["House", "Apartment", "Condo", "Townhouse", "Loft"] as const
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "6+ months"]
// demo image pool the owner "uploads" from — simulates a real upload pipeline
const SAMPLE_IMAGES = [
  "https://sfile.chatglm.cn/images-ppt/3c1d82ffa132.png",
  "https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg",
  "https://sfile.chatglm.cn/images-ppt/881392c04080.jpg",
  "https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg",
  "https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg",
]

const STEPS = ["About you", "Property", "Pricing", "Photos", "Description", "Review"]

export function ListPropertyModal() {
  const { active, close, showToast } = useModal()
  const open = active === "list-property"

  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    ownerName: "", email: "", phone: "",
    address: "", type: "House" as typeof TYPES[number], bedrooms: 3, bathrooms: 2, area: 1800, yearBuilt: 2005,
    expectedPrice: 650000, timeline: "1–3 months",
    description: "", notes: "", imageUrls: [] as string[],
  })

  const update = (patch: Partial<typeof form>) => setForm({ ...form, ...patch })

  const submit = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/list-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not submit")
      setDone(true)
      showToast("Listing submitted", "An agent will call within one business day.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit")
    } finally {
      setLoading(false)
    }
  }

  const closeAndReset = () => { close(); setTimeout(() => { setStep(0); setDone(false); setError("") }, 250) }

  const canNext = [
    form.ownerName && form.email && form.phone,
    form.address && form.area > 0,
    form.expectedPrice > 0,
    form.imageUrls.length >= 1,
    form.description.length >= 20,
    true,
  ][step]

  return (
    <ModalShell open={open} onClose={closeAndReset} size="xl"
      title={done ? undefined : "List your property"}
      subtitle={done ? undefined : "Tell us about your home. We'll handle the photos, pricing, and buyers."}>
      {done ? (
        <div className="py-4 text-center">
          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-7 w-7 text-primary" /></motion.span>
          <h3 className="mt-4 text-xl font-bold text-foreground">We received your listing</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Thanks {form.ownerName.split(" ")[0]}. An agent will call within one business day to verify the details and finalize your listing.</p>
          <div className="mx-auto mt-5 max-w-sm space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What happens next</p>
            <p className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />An agent reviews your submission</p>
            <p className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />We schedule a free photo shoot and walkthrough</p>
            <p className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Your home goes live within 48 hours of approval</p>
          </div>
          <Button onClick={closeAndReset} className="mt-6">Done</Button>
        </div>
      ) : (
        <>
          {/* progress */}
          <div className="mb-6 flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-1.5">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                <span className={`hidden text-xs font-medium sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label className="text-sm font-medium">Owner name *</Label><Input value={form.ownerName} onChange={(e) => update({ ownerName: e.target.value })} placeholder="Jane Doe" /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Phone *</Label><Input value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(555) 555-0100" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label className="text-sm font-medium">Email *</Label><Input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} placeholder="jane@example.com" /></div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2"><Label className="text-sm font-medium">Property address *</Label><Input value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="123 Main St, Austin, TX 78704" /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Property type</Label>
                <select value={form.type} onChange={(e) => update({ type: e.target.value as typeof TYPES[number] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Year built</Label><Input type="number" value={form.yearBuilt} onChange={(e) => update({ yearBuilt: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={(e) => update({ bedrooms: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Bathrooms</Label><Input type="number" step="0.5" value={form.bathrooms} onChange={(e) => update({ bathrooms: Number(e.target.value) })} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label className="text-sm font-medium">Area (sqft) *</Label><Input type="number" value={form.area} onChange={(e) => update({ area: Number(e.target.value) })} /></div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label className="text-sm font-medium">Expected price ($) *</Label><Input type="number" value={form.expectedPrice} onChange={(e) => update({ expectedPrice: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Selling timeline</Label>
                <select value={form.timeline} onChange={(e) => update({ timeline: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                Not sure on price? Our agent will prepare a free comparative market analysis before listing.
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <Label className="text-sm font-medium">Add photos *</Label>
              <p className="mb-3 text-xs text-muted-foreground">For the demo, pick from sample photos. In production this is a real upload to cloud storage.</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {SAMPLE_IMAGES.map((img) => {
                  const sel = form.imageUrls.includes(img)
                  return (
                    <button key={img} onClick={() => update({ imageUrls: sel ? form.imageUrls.filter((x) => x !== img) : [...form.imageUrls, img] })}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${sel ? "border-primary" : "border-border hover:border-primary/40"}`}>
                      <img src={img} alt="sample" className="h-full w-full object-cover" />
                      {sel && <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><CheckCircle2 className="h-3.5 w-3.5" /></span>}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{form.imageUrls.length} photo(s) selected</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="space-y-1.5"><Label className="text-sm font-medium">Description * (min 20 chars)</Label><Textarea rows={5} value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="What makes this home special? Tell buyers about the light, the layout, the neighborhood…" /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Additional notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Anything else we should know — upgrades, recent repairs, HOA details…" /></div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                <p className="font-semibold text-foreground">{form.address || "Your property"}</p>
                <p className="text-muted-foreground">{form.type} · {form.bedrooms} bd · {form.bathrooms} ba · {form.area} sqft</p>
                <p className="mt-2 font-bold text-primary">${form.expectedPrice.toLocaleString()}</p>
                <p className="mt-2 text-foreground/80">{form.description.slice(0, 160)}{form.description.length > 160 ? "…" : ""}</p>
                <div className="mt-2 flex gap-1.5">
                  {form.imageUrls.slice(0, 4).map((u) => <img key={u} src={u} alt="" className="h-12 w-12 rounded object-cover" />)}
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={submit} disabled={loading} className="w-full gap-2">{loading ? "Submitting…" : <>Submit listing <CheckCircle2 className="h-4 w-4" /></>}</Button>
            </div>
          )}

          {/* nav */}
          <div className="mt-5 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Back</button>
            ) : <span />}
            {step < 5 && (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext} className="gap-1.5">Next <ChevronRight className="h-4 w-4" /></Button>
            )}
          </div>
        </>
      )}
    </ModalShell>
  )
}
