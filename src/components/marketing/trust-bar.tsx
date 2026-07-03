"use client"

import { useCountUp } from "@/hooks/use-count-up"

const STATS = [
  { value: 10, suffix: "+", label: "Years helping people move" },
  { value: 1200, suffix: "+", label: "Families settled" },
  { value: 1.8, prefix: "$", suffix: "B+", label: "In closed sales", decimals: 1 },
  { value: 10, suffix: "", label: "Cities, one standard" },
]

export function TrustBar() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/50 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}

function StatCell({ value, prefix, suffix, label, decimals }: { value: number; prefix?: string; suffix?: string; label: string; decimals?: number }) {
  const { value: animated, ref } = useCountUp(value)
  const display = decimals ? animated.toFixed(decimals) : Math.round(animated).toLocaleString()
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-6 text-center sm:py-7">
      <span ref={ref} className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {prefix}{display}{suffix}
      </span>
      <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">{label}</span>
    </div>
  )
}
