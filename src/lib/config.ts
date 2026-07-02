/**
 * Centralized configuration and constants.
 *
 * All environment access and magic numbers live here so they can be audited
 * in one place. Env vars are read lazily (at call time, not module load) so
 * the app doesn't crash during build if an env var is missing — the API
 * routes handle the missing-DB case gracefully.
 */

export const config = {
  /** Database connection string. */
  databaseUrl: () => process.env.DATABASE_URL ?? "",

  /** Node environment. */
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",

  /** Site URL for SEO/sitemap (no trailing slash). */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://z0rocode.com",

  /** Optional Unsplash key (demo never reads this at runtime). */
  unsplashKey: () => process.env.UNSPLASH_ACCESS_KEY ?? "",
} as const

/**
 * Rate limit presets per endpoint type.
 * Tuned to stop abuse without blocking real users.
 */
export const RATE_LIMITS = {
  /** Newsletter + contact form: 10 per 10 min */
  leads: { limit: 10, windowMs: 600_000 },
  /** Signups: 5 per 10 min */
  signup: { limit: 5, windowMs: 600_000 },
  /** Appointment bookings: 5 per 10 min */
  appointment: { limit: 5, windowMs: 600_000 },
  /** Valuation requests: 5 per 10 min */
  valuation: { limit: 5, windowMs: 600_000 },
  /** Property submissions: 3 per hour (stricter — higher spam risk) */
  listProperty: { limit: 3, windowMs: 3_600_000 },
} as const

/** Pagination defaults. */
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
} as const

/** Property type + status enums (kept in sync with the Prisma schema). */
export const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Townhouse", "Loft"] as const
export const PROPERTY_STATUSES = ["For Sale", "Pending", "Sold"] as const

/** Lead pipeline stages, in pipeline order. */
export const LEAD_STAGES = [
  "new",
  "contacted",
  "consultation",
  "client",
  "won",
  "lost",
] as const

/** Consultation types. */
export const APPOINTMENT_TYPES = ["video", "phone", "office"] as const
