"use client"

import { motion } from "framer-motion"
import { ArrowRight, Home, Tag } from "lucide-react"
import Link from "next/link"

export function Journeys() {
  return (
    <section className="border-b border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Where do you start</p>
          <h2 className="text-h2 mt-3 text-foreground">Buying or selling? We&apos;ve got a path for both.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <JourneyCard
            intent="buying"
            title="I'm buying a home."
            body="Tell us your budget and your dream. We'll send you homes that actually fit and walk you through every step."
            cta="Start with buying"
            href="/buy"
            image="https://sfile.chatglm.cn/images-ppt/931d33bb6e17.jpg"
          />
          <JourneyCard
            intent="selling"
            title="I'm selling my home."
            body="See what your home is worth and how we'd sell it. No pressure, no obligation, just a clear plan."
            cta="Get a valuation"
            href="/sell/valuation"
            image="https://sfile.chatglm.cn/images-ppt/ee0e406ac866.jpg"
          />
        </div>
      </div>
    </section>
  )
}

function JourneyCard({ intent, title, body, cta, href, image }: { intent: "buying" | "selling"; title: string; body: string; cta: string; href: string; image: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: intent === "buying" ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={href} className="group relative block overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
          <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {intent === "buying" ? <Home className="h-3.5 w-3.5 text-primary" /> : <Tag className="h-3.5 w-3.5 text-primary" />}
            {intent === "buying" ? "For buyers" : "For sellers"}
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-background">{title}</h3>
            <p className="mt-2 max-w-md text-sm text-background/80">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
