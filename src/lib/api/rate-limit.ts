/**
 * Lightweight in-memory rate limiter for public form endpoints.
 *
 * In production on Vercel (serverless, multiple instances), this is a
 * best-effort per-instance limiter — it won't stop a determined distributed
 * attacker, but it stops casual abuse and bot spam. For true distributed
 * rate limiting, back this with Upstash Redis (see README).
 *
 * Usage:
 *   const ok = rateLimit({ key: ip, limit: 5, windowMs: 60_000 })
 *   if (!ok) return tooManyRequests()
 */

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()

// Periodic cleanup so the map doesn't grow unbounded.
// (In serverless this resets per cold start anyway, so this is mostly for dev.)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key)
    }
  }, 60_000).unref?.()
}

export function rateLimit({
  key,
  limit = 5,
  windowMs = 60_000,
}: {
  key: string
  limit?: number
  windowMs?: number
}): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = buckets.get(key)

  // Expired or new — start a fresh bucket
  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  // Within window — increment
  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

/** Extract a best-effort client IP from a Next.js Request. */
export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}
