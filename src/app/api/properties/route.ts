import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serializeProperty } from "@/lib/serialize"
import type { PropertyFilters } from "@/lib/types"

/**
 * GET /api/properties
 * Supports server-side filtering + sorting. The /buy page fetches once and
 * also filters client-side for instant UX; this endpoint handles shareable
 * pre-filtered URLs (e.g. /buy?type=Condo&minPrice=500000).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters: PropertyFilters = {
    q: searchParams.get("q")?.trim() || undefined,
    city: searchParams.get("city")?.trim() || "All",
    type: (searchParams.get("type") as PropertyFilters["type"]) || "All",
    status: (searchParams.get("status") as PropertyFilters["status"]) || "All",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    bedrooms: searchParams.get("bedrooms")
      ? (searchParams.get("bedrooms") as unknown as number)
      : "All",
    sort: (searchParams.get("sort") as PropertyFilters["sort"]) || "featured",
  }

  const where: any = { approved: true }
  if (filters.city && filters.city !== "All") where.city = filters.city
  if (filters.type && filters.type !== "All") where.type = filters.type
  if (filters.status && filters.status !== "All") where.status = filters.status
  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = filters.minPrice
    if (filters.maxPrice) where.price.lte = filters.maxPrice
  }
  if (filters.bedrooms && filters.bedrooms !== "All") {
    where.bedrooms = { gte: Number(filters.bedrooms) }
  }

  let orderBy: any = [{ featured: "desc" }, { createdAt: "desc" }]
  if (filters.sort === "price-low") orderBy = { price: "asc" }
  if (filters.sort === "price-high") orderBy = { price: "desc" }
  if (filters.sort === "newest") orderBy = { createdAt: "desc" }

  let rows: any[] = []
  try {
    rows = await db.property.findMany({
      where,
      include: { agent: true },
      orderBy,
    })
  } catch {
    // DB unavailable (e.g. not yet seeded) — return empty so the UI shows
    // a graceful empty state instead of crashing.
    return NextResponse.json({ properties: [], count: 0 })
  }

  let properties = rows.map(serializeProperty)

  // text search
  if (filters.q) {
    const q = filters.q.toLowerCase()
    properties = properties.filter((p) =>
      `${p.title} ${p.address} ${p.city} ${p.state} ${p.city}, ${p.state} ${p.features.join(" ")}`
        .toLowerCase()
        .includes(q),
    )
  }

  return NextResponse.json({ properties, count: properties.length })
}
