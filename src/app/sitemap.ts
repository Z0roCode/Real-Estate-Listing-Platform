import type { MetadataRoute } from "next"

/**
 * Dynamic sitemap generated from the database.
 * Covers all static pages + every approved property and agent.
 *
 * The DB calls are wrapped in try/catch so the build never fails if the
 * database is unavailable (e.g. during a Vercel build before seeding).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://real-estate-listing-platform-tau.vercel.app"

  const staticRoutes = [
    { url: baseUrl, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/buy`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/sell`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/sell/valuation`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/agents`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/insights`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/dashboard`, changeFrequency: "weekly" as const, priority: 0.4 },
  ]

  const insights = [
    "what-800k-buys-in-austin",
    "three-things-that-sell-a-home",
    "mortgage-rates-explained",
    "first-time-buyer-guide",
    "how-we-price-a-home",
    "investor-playbook-2026",
  ]

  // Attempt to pull dynamic routes from the DB. If the DB is unavailable
  // (e.g. during a Vercel build before seeding), we return static routes only.
  let propertyRoutes: MetadataRoute.Sitemap = []
  let agentRoutes: MetadataRoute.Sitemap = []

  try {
    const { db } = await import("@/lib/db")
    const [properties, agents] = await Promise.all([
      db.property.findMany({ where: { approved: true }, select: { slug: true, updatedAt: true } }),
      db.agent.findMany({ select: { slug: true } }),
    ])
    propertyRoutes = properties.map((p) => ({ url: `${baseUrl}/buy/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 }))
    agentRoutes = agents.map((a) => ({ url: `${baseUrl}/agents/${a.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }))
  } catch {
    // DB unavailable — static routes only
  }

  return [
    ...staticRoutes.map((r) => ({ url: r.url, lastModified: new Date(), changeFrequency: r.changeFrequency, priority: r.priority })),
    ...propertyRoutes,
    ...agentRoutes,
    ...insights.map((s) => ({ url: `${baseUrl}/insights/${s}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
  ]
}
