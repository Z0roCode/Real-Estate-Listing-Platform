"use client"

import { useEffect, useRef, useState } from "react"

/** Count-up animation that respects prefers-reduced-motion. */
export function useCountUp(target: number, durationMs = 1500) {
  // If reduced motion is preferred, render the final value immediately.
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return 0
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    return reduce ? target : 0
  })
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(target * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, durationMs])

  return { value, ref }
}
