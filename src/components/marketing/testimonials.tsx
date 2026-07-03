"use client"

import { motion } from "framer-motion"
import { Quote, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const CASE = {
  title: "How we found the Chen family their forever home in 14 days.",
  body: "The Chens had been outbid three times. We rebuilt their offer strategy, found an off-market match in Barton Hills, and negotiated $40K under ask. They moved in before school started.",
  results: ["14 days to close", "$40K under ask", "Barton Hills, Austin"],
}

const TESTIMONIALS = [
  { quote: "They treated our sale like it was their own home. Every question answered the same day.", name: "Sarah & Tom", detail: "Sold in Denver" },
  { quote: "As first-time buyers we were terrified. James made it feel doable from the first call.", name: "Maya R.", detail: "Bought in Seattle" },
]

export function Testimonials() {
  const { openBooking } = useModal()
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Client stories</p>
          <h2 className="text-h2 mt-3 text-foreground">People we&apos;ve helped move well.</h2>
        </div>

        {/* featured case study */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-8 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10 lg:grid-cols-2"
        >
          <div>
            <span className="inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Case study</span>
            <h3 className="mt-3 text-xl font-bold leading-snug text-foreground sm:text-2xl">{CASE.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{CASE.body}</p>
            <Button onClick={() => openBooking()} className="mt-6 gap-2">Work with us <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-3 gap-4 self-center">
            {CASE.results.map((r) => (
              <div key={r} className="rounded-xl bg-primary/5 p-4 text-center ring-1 ring-inset ring-primary/15">
                <p className="font-mono text-lg font-bold text-primary sm:text-2xl">{r.split(" ")[0]}</p>
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{r.split(" ").slice(1).join(" ")}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* testimonials */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <Quote className="h-7 w-7 text-primary/40" />
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Client stories are illustrative for this portfolio demo. Real client names and details are used on launch.
        </p>
      </div>
    </section>
  )
}
