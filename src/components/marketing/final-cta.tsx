"use client"

import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

export function FinalCTA() {
  const { openBooking } = useModal()
  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="absolute inset-0 opacity-20">
        <img src="https://sfile.chatglm.cn/images-ppt/5ac036799bf4.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <p className="eyebrow">Ready when you are</p>
        <h2 className="text-display mt-4 text-background">Let&apos;s find your next move.</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-background/70 sm:text-lg">
          Book a free 30-minute consultation. We&apos;ll talk through where you are and where you want to be.
          No pressure, no scripts.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => openBooking()} className="gap-2 text-base">
            <Calendar className="h-4 w-4" /> Book a consultation
          </Button>
          <Button size="lg" variant="secondary" asChild className="gap-2 text-base">
            <a href="/buy">Browse homes <ArrowRight className="h-4 w-4" /></a>
          </Button>
        </div>
      </div>
    </section>
  )
}
