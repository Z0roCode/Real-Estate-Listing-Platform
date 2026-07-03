"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const POPULAR = ["Austin", "Denver", "Seattle", "Miami", "Nashville"]

export function Hero({ listingCount }: { listingCount: number }) {
  const router = useRouter()
  const { openBooking } = useModal()
  const [q, setQ] = useState("")

  const search = (val: string) => {
    router.push(val ? `/buy?q=${encodeURIComponent(val)}` : "/buy")
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* background image */}
      <div className="absolute inset-0">
        <img
          src="https://sfile.chatglm.cn/images-ppt/adb69aa368c0.jpg"
          alt="Featured modern luxury home"
          className="h-full w-full object-cover animate-kenburns"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground ring-1 ring-inset ring-primary/30 backdrop-blur">
            <TrendingUp className="h-3.5 w-3.5" />
            {listingCount} active listings · 10 cities
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-display mt-5 text-background">
            Find a place you&apos;ll <span className="text-primary">love to call home.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-relaxed text-background/80 sm:text-lg">
            Handpicked homes, honest pricing, and a team that actually picks up the phone.
            Buying or selling, we make the move feel simple.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => openBooking()} className="gap-2 text-base">
              <Calendar className="h-4 w-4" /> Book a consultation
            </Button>
            <Button size="lg" variant="secondary" asChild className="gap-2 text-base">
              <a href="/buy">Browse homes <ArrowRight className="h-4 w-4" /></a>
            </Button>
          </motion.div>

          {/* trust line */}
          <motion.p variants={fadeUp} className="mt-5 text-sm text-background/60">
            Trusted by 1,200+ families across 10 cities · In business since 2014
          </motion.p>

          {/* inline search */}
          <motion.form
            variants={fadeUp}
            onSubmit={(e) => { e.preventDefault(); search(q) }}
            className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-background/15 bg-background/10 p-2 backdrop-blur-md sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by city, neighborhood, or address"
                className="h-12 w-full rounded-lg border-0 bg-background pl-11 pr-4 text-sm text-foreground shadow-sm outline-none ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                aria-label="Search properties by location"
              />
            </div>
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              <Search className="h-4 w-4" /> Search
            </button>
          </motion.form>

          {/* popular */}
          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-background/70">
            <span>Popular:</span>
            {POPULAR.map((c) => (
              <button key={c} onClick={() => search(c)} className="font-medium text-background/90 underline-offset-4 transition hover:text-primary hover:underline">
                {c}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}
