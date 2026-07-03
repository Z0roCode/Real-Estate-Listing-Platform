"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Video, Phone, Building, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { ModalShell } from "@/components/modals/modal-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"
import { prettyDate, prettyTime } from "@/lib/helpers"

const TYPES = [
  { id: "video" as const, label: "Video call", icon: Video, desc: "Google Meet, 30 min" },
  { id: "phone" as const, label: "Phone", icon: Phone, desc: "We call you, 30 min" },
  { id: "office" as const, label: "In office", icon: Building, desc: "Austin HQ, 45 min" },
]

export function BookingModal() {
  const { active, close, bookingContext, showToast } = useModal()
  const open = active === "booking"

  const [step, setStep] = useState(0)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [type, setType] = useState<"video" | "phone" | "office">(bookingContext.defaultType ?? "video")
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // next 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })
  const slots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]

  const reset = () => {
    setStep(0); setDate(""); setTime(""); setForm({ name: "", email: "", phone: "" }); setDone(false); setError("")
  }

  const submit = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date, time, type, propertyId: bookingContext.propertyId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not book")
      setDone(true)
      showToast("Consultation booked", `We'll see you ${prettyDate(date)} at ${prettyTime(time)}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not book")
    } finally {
      setLoading(false)
    }
  }

  const closeAndReset = () => { close(); setTimeout(reset, 250) }

  return (
    <ModalShell
      open={open}
      onClose={closeAndReset}
      size="lg"
      title={done ? undefined : bookingContext.propertyTitle ? `Schedule a viewing` : `Book a free consultation`}
      subtitle={done ? undefined : bookingContext.propertyTitle ? bookingContext.propertyTitle : "30 minutes with a Z0roCode agent. No pressure, no scripts."}
    >
      {done ? (
        <SuccessState
          icon={<CheckCircle2 className="h-7 w-7 text-primary" />}
          title="You're booked in"
          body={`See you ${prettyDate(date)} at ${prettyTime(time)} (${TYPES.find((t) => t.id === type)?.label}). We sent a confirmation and will remind you the day before.`}
          next={["You'll get a calendar invite by email", "An agent confirms within 1 business day", "Reply to the email to reschedule anytime"]}
          onClose={closeAndReset}
        />
      ) : (
        <>
          {/* progress */}
          <div className="mb-6 flex items-center gap-2">
            {["Date", "Time", "Type", "Details"].map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                <span className={`text-xs font-medium ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < 3 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">Pick a day</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((d) => {
                  const iso = d.toISOString().slice(0, 10)
                  const sel = date === iso
                  return (
                    <button key={iso} onClick={() => { setDate(iso); setStep(1) }}
                      className={`flex flex-col items-center rounded-lg border p-2.5 transition-all ${sel ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <span className="text-[10px] font-medium uppercase text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span className="text-base font-bold text-foreground">{d.getDate()}</span>
                      <span className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">{prettyDate(date)} — pick a time</p>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((t) => (
                  <button key={t} onClick={() => { setTime(t); setStep(2) }}
                    className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${time === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}>
                    {prettyTime(t)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">How would you like to meet?</p>
              <div className="space-y-2">
                {TYPES.map((t) => (
                  <button key={t.id} onClick={() => { setType(t.id); setStep(3) }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3.5 text-left transition-all ${type === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><t.icon className="h-5 w-5" /></span>
                    <div><p className="text-sm font-semibold text-foreground">{t.label}</p><p className="text-xs text-muted-foreground">{t.desc}</p></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name" required>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
                </Field>
                <Field label="Phone" required>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-0100" />
                </Field>
              </div>
              <Field label="Email" required>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
              </Field>
              <div className="rounded-lg bg-muted/60 p-3 text-sm">
                <p className="font-medium text-foreground">{prettyDate(date)} at {prettyTime(time)} · {TYPES.find((t) => t.id === type)?.label}</p>
                {bookingContext.propertyTitle && <p className="text-muted-foreground">About: {bookingContext.propertyTitle}</p>}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={submit} disabled={loading || !form.name || !form.email || !form.phone} className="w-full gap-2">
                {loading ? "Booking…" : <>Confirm booking <ChevronRight className="h-4 w-4" /></>}
              </Button>
            </div>
          )}

          {/* nav */}
          {step > 0 && step < 3 && (
            <button onClick={() => setStep(step - 1)} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          )}
        </>
      )}
    </ModalShell>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
    </div>
  )
}

function SuccessState({ icon, title, body, next, onClose }: { icon: React.ReactNode; title: string; body: string; next: string[]; onClose: () => void }) {
  return (
    <div className="py-4 text-center">
      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">{icon}</motion.span>
      <h3 className="mt-4 text-xl font-bold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      <div className="mx-auto mt-5 max-w-sm space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What happens next</p>
        {next.map((n) => (
          <p key={n} className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{n}</p>
        ))}
      </div>
      <Button onClick={onClose} className="mt-6">Done</Button>
    </div>
  )
}
