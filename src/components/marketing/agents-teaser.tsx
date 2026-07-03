"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Agent } from "@/lib/types"

export function AgentsTeaser({ agents }: { agents: Agent[] }) {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Meet the team</p>
            <h2 className="text-h2 mt-3 text-foreground">The people who&apos;ll get you home.</h2>
          </div>
          <Link href="/agents" className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            Meet everyone <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {agents.slice(0, 4).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href={`/agents/${a.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={a.photo}
                    alt={a.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-foreground">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{a.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-primary">{a.specialty}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link href="/agents" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:hidden">
          Meet everyone <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
