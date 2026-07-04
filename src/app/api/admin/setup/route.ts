import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * POST /api/admin/setup
 * One-click database setup for Vercel deploys. Seeds the full dataset
 * (agents + properties + sample leads/appointments) in one call so you don't
 * need a terminal. Run from /admin/setup after setting DATABASE_URL on Vercel.
 */

const AGENTS = [
  { name: "Elena Vasquez", title: "Senior Buyer's Agent", specialty: "Austin's neighborhoods, memorized.", bio: "Elena has helped over 300 families find their footing in Austin over the last decade. She knows which streets flood, which schools feed where, and which homes are fairly priced the moment they hit the market.", email: "elena@z0rocode.com", phone: "(512) 555-0142", photo: "https://sfile.chatglm.cn/images-ppt/888e2f600ce4.jpg", city: "Austin", focusAreas: ["Barton Hills", "Zilker", "Cherrywood", "Mueller"], soldCount: 312, rating: 4.9, slug: "elena-vasquez" },
  { name: "Marcus Chen", title: "Luxury Specialist", specialty: "Homes over $2M, handled with care.", bio: "Marcus specializes in luxury and waterfront properties across Miami and the West Coast. Before real estate he ran a design studio, so he reads a home the way an architect does.", email: "marcus@z0rocode.com", phone: "(415) 555-0188", photo: "https://sfile.chatglm.cn/images-ppt/b1dce3f9ed9b.jpg", city: "Miami", focusAreas: ["Miami Beach", "Waterfront", "Luxury Condos", "Hillsborough"], soldCount: 184, rating: 5.0, slug: "marcus-chen" },
  { name: "Priya Patel", title: "Listing Agent", specialty: "Pricing that holds up under scrutiny.", bio: "Priya lists homes and sells them for the number she says she will. Her pricing is built on comps, condition, and current demand, never on wishful thinking.", email: "priya@z0rocode.com", phone: "(206) 555-0173", photo: "https://sfile.chatglm.cn/images-ppt/27388b9df998.png", city: "Seattle", focusAreas: ["Capitol Hill", "Ballard", "West Seattle", "Bellevue"], soldCount: 406, rating: 4.9, slug: "priya-patel" },
  { name: "James O'Brien", title: "First-Time Buyer Guide", specialty: "Patient, clear, and on your side.", bio: "James works with first-time buyers. He knows the process feels overwhelming, so he slows it down and explains every step. No question is too small.", email: "james@z0rocode.com", phone: "(312) 555-0119", photo: "https://sfile.chatglm.cn/images-ppt/51ff1eb439c0.jpg", city: "Chicago", focusAreas: ["Lincoln Park", "Logan Square", "River North", "Pilsen"], soldCount: 258, rating: 4.8, slug: "james-obrien" },
  { name: "Sofia Romano", title: "Investment Advisor", specialty: "Numbers first, emotion second.", bio: "Sofia works with investors and second-home buyers who want a clear return story. She models cash flow, appreciation, and exit options before she ever shows a property.", email: "sofia@z0rocode.com", phone: "(305) 555-0166", photo: "https://sfile.chatglm.cn/images-ppt/27c842c69a3e.jpg", city: "Nashville", focusAreas: ["12South", "East Nashville", "Germantown", "Downtown"], soldCount: 201, rating: 4.9, slug: "sofia-romano" },
]

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) }

// A compact set of 6 representative properties for the one-click seed.
// The full 18-property seed lives in prisma/seed.ts for terminal use.
const PROPERTIES = [
  { title: "Modern Hillside Retreat with Pool", description: "Wake up to wide hilltop views every morning. This four-bedroom home is built for real life, with an open kitchen at the center, a living room that flows straight onto the deck, and a primary suite tucked away like a private retreat. A pool, a media room, and solar panels make the weekends easy and the bills small.", price: 1850000, bedrooms: 4, bathrooms: 3.5, sqft: 3650, lotSize: 0.42, address: "2408 Ridgeline Dr", city: "Austin", state: "TX", zip: "78704", latitude: 30.2549, longitude: -97.7891, type: "House", status: "For Sale", yearBuilt: 2021, energyRating: "A", features: ["Hilltop views", "Kitchen built for gathering", "Primary suite wing", "Media room", "Swimming pool", "Solar panels", "2-car garage"], amenities: ["Pool", "Solar", "Media room", "EV charger", "Smart home"], agentSlug: "elena-vasquez", exterior: "https://sfile.chatglm.cn/images-ppt/3c1d82ffa132.png", withPool: true, featured: true, views: 412 },
  { title: "Sunny Mission District Condo", description: "Morning coffee on your own south-facing patio. This ground-floor condo keeps the character of 1920s San Francisco with modern updates where it counts, a refreshed kitchen, two roomy bedrooms, and in-unit laundry.", price: 899000, bedrooms: 2, bathrooms: 2, sqft: 1180, address: "744 Valencia St, Unit 1", city: "San Francisco", state: "CA", zip: "94110", latitude: 37.7599, longitude: -122.4214, type: "Condo", status: "For Sale", yearBuilt: 1924, energyRating: "C", features: ["Private patio", "In-unit laundry", "Dedicated parking", "Updated kitchen", "Walk to cafés", "Pet friendly"], amenities: ["Parking", "Laundry", "Storage", "Pet friendly"], agentSlug: "marcus-chen", exterior: "https://sfile.chatglm.cn/images-ppt/121f2d37c8c2.jpg", views: 289 },
  { title: "Craftsman Bungalow in Capitol Hill", description: "Real Craftsman character, lovingly kept. Original millwork, a cozy fireplace, and a flowing layout make this 1912 bungalow feel like home the moment you walk in.", price: 1125000, bedrooms: 4, bathrooms: 2.5, sqft: 2480, lotSize: 0.12, address: "518 12th Ave E", city: "Seattle", state: "WA", zip: "98102", latitude: 47.6232, longitude: -122.3197, type: "House", status: "For Sale", yearBuilt: 1912, energyRating: "D", features: ["Original millwork", "Wood-burning fireplace", "Finished basement", "Fenced yard", "Detached garage", "Walk to light rail"], amenities: ["Fireplace", "Garage", "Garden", "Basement"], agentSlug: "priya-patel", exterior: "https://sfile.chatglm.cn/images-ppt/fb823fa5177b.jpg", featured: true, views: 503 },
  { title: "Waterfront Modern with Infinity Pool", description: "The bay is your backyard. Walls of glass slide open to a 60-foot infinity pool, so the view never leaves the frame. Six bedrooms, a summer kitchen, a wine room, and a private dock.", price: 4250000, bedrooms: 6, bathrooms: 5.5, sqft: 6200, lotSize: 0.55, address: "2280 Bay View Ln", city: "Miami", state: "FL", zip: "33139", latitude: 25.7911, longitude: -80.1378, type: "House", status: "For Sale", yearBuilt: 2019, energyRating: "A", features: ["Bay frontage", "60ft infinity pool", "Summer kitchen", "Wine room", "Home theater", "Private dock"], amenities: ["Pool", "Dock", "Wine room", "Theater", "Smart home", "Garage"], agentSlug: "marcus-chen", exterior: "https://sfile.chatglm.cn/images-ppt/adb69aa368c0.jpg", withPool: true, featured: true, views: 731 },
  { title: "Penthouse Condo with Skyline Views", description: "Floor-to-ceiling windows on every wall, with downtown and mountain views that change with the light. The kitchen is sleek and modern, the primary bath feels like a spa.", price: 1295000, bedrooms: 2, bathrooms: 2, sqft: 1720, address: "1430 Larimer St, PH 31", city: "Denver", state: "CO", zip: "80202", latitude: 39.7495, longitude: -104.9923, type: "Condo", status: "For Sale", yearBuilt: 2017, energyRating: "B", features: ["Penthouse level", "Skyline views", "400 sqft terrace", "Spa bath", "2 parking spaces", "Concierge"], amenities: ["Concierge", "Gym", "Terrace", "Parking", "Doorman"], agentSlug: "sofia-romano", exterior: "https://sfile.chatglm.cn/images-ppt/f5851648e8d1.jpg", featured: true, views: 521 },
  { title: "Nashville Townhouse with Roof Deck", description: "Two blocks from the bistros and boutiques of 12South. This three-bedroom townhouse has wide-plank floors, a gas fireplace, and a kitchen with a walk-in pantry.", price: 829000, bedrooms: 3, bathrooms: 3.5, sqft: 2210, address: "2304 12th Ave S", city: "Nashville", state: "TN", zip: "37204", latitude: 36.1349, longitude: -86.7856, type: "Townhouse", status: "For Sale", yearBuilt: 2019, energyRating: "B", features: ["Roof deck", "Gas fireplace", "Walk-in pantry", "Media room", "Custom closets", "Attached garage"], amenities: ["Roof deck", "Garage", "Fireplace", "Media room"], agentSlug: "sofia-romano", exterior: "https://sfile.chatglm.cn/images-ppt/eb1153c193cb.jpg", featured: true, views: 345 },
]

const INTERIORS = {
  living: "https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg",
  kitchen: "https://sfile.chatglm.cn/images-ppt/881392c04080.jpg",
  bedroom: "https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg",
  bathroom: "https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg",
  bedroom2: "https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg",
  pool: "https://sfile.chatglm.cn/images-ppt/6e2b040b29ad.jpg",
}

function buildImages(exterior: string, i: number, withPool = false) {
  const imgs = [exterior, INTERIORS.living, INTERIORS.kitchen, INTERIORS.bedroom, INTERIORS.bathroom, INTERIORS.bedroom2]
  if (withPool) imgs.push(INTERIORS.pool)
  return imgs
}

const NEARBY: Record<string, any> = {
  Austin: { schools: ["Barton Hills Elementary (9/10)", "O. Henry Middle (8/10)"], hospitals: ["Seton Medical — 1.2 mi"], shopping: ["Zilker Market — 0.4 mi"], transit: ["Rapid 801 — 3 blocks"] },
  "San Francisco": { schools: ["Marshall Elementary (8/10)"], hospitals: ["ZSFGH — 1.5 mi"], shopping: ["Valencia Corridor — 0.2 mi"], transit: ["BART 16th St — 0.5 mi"] },
  Seattle: { schools: ["Stevens Elementary (8/10)"], hospitals: ["Swedish — 1.1 mi"], shopping: ["Broadway Market — 0.3 mi"], transit: ["Light Rail — 0.4 mi"] },
  Miami: { schools: ["South Pointe Elementary (8/10)"], hospitals: ["Mount Sinai — 1.0 mi"], shopping: ["Lincoln Road — 1.2 mi"], transit: ["South Beach Local — 1 block"] },
  Denver: { schools: ["Steck Elementary (8/10)"], hospitals: ["Presbyterian — 1.8 mi"], shopping: ["Cherry Creek — 0.6 mi"], transit: ["Bus 10 — 1 block"] },
  Nashville: { schools: ["Glendale Elementary (8/10)"], hospitals: ["Vanderbilt — 2.1 mi"], shopping: ["12South — 0.1 mi"], transit: ["Bus 17 — 1 block"] },
}

export async function POST() {
  try {
    // Check connection first
    const agentCount = await db.agent.count().catch(() => -1)
    if (agentCount === -1) {
      return NextResponse.json(
        { error: "Cannot connect to the database. Make sure DATABASE_URL is set correctly on Vercel (with ?pgbouncer=true for Supabase) and the tables exist. Run 'bun run db:push' if tables are missing." },
        { status: 500 },
      )
    }

    // Already seeded?
    if (agentCount > 0) {
      const propCount = await db.property.count()
      return NextResponse.json({
        ok: true,
        message: `Database already seeded. ${agentCount} agents and ${propCount} properties are present.`,
        alreadySeeded: true,
        counts: { agents: agentCount, properties: propCount },
      })
    }

    // Seed agents
    const agentMap: Record<string, string> = {}
    for (const a of AGENTS) {
      const ag = await db.agent.create({ data: { ...a, focusAreas: JSON.stringify(a.focusAreas) } })
      agentMap[a.slug] = ag.id
    }

    // Seed properties
    for (let i = 0; i < PROPERTIES.length; i++) {
      const p = PROPERTIES[i]
      const images = buildImages(p.exterior, i, p.withPool)
      const daysAgo = Math.floor(Math.random() * 45) + 2
      const listedDate = new Date(Date.now() - daysAgo * 86400000)
      await db.property.create({
        data: {
          slug: slugify(p.title),
          title: p.title,
          description: p.description,
          price: p.price,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          sqft: p.sqft,
          lotSize: p.lotSize ?? null,
          address: p.address,
          city: p.city,
          state: p.state,
          zip: p.zip,
          latitude: p.latitude,
          longitude: p.longitude,
          type: p.type,
          status: p.status,
          yearBuilt: p.yearBuilt,
          energyRating: p.energyRating,
          images: JSON.stringify(images),
          features: JSON.stringify(p.features),
          amenities: JSON.stringify(p.amenities),
          nearby: JSON.stringify(NEARBY[p.city] ?? NEARBY.Austin),
          history: JSON.stringify([
            { date: listedDate.toISOString().slice(0, 10), event: "Listed for sale", price: p.price },
          ]),
          agentId: agentMap[p.agentSlug],
          featured: p.featured ?? false,
          approved: true,
          views: p.views,
          createdAt: listedDate,
        },
      })
    }

    // Seed a few sample leads
    const names = ["Jordan Avery", "Riley Thompson", "Casey Brooks", "Morgan Lee"]
    const stages = ["new", "contacted", "consultation", "client"]
    const sources = ["homepage", "signup", "valuation", "contact"]
    for (let i = 0; i < 4; i++) {
      await db.lead.create({
        data: {
          name: names[i],
          email: names[i].toLowerCase().replace(/\s+/g, ".") + "@example.com",
          phone: `(555) 555-${String(1000 + i).slice(-4)}`,
          intent: i % 2 === 0 ? "buying" : "selling",
          budget: [400000, 650000, 900000, 1300000][i],
          city: ["Austin", "Denver", "Seattle", "Miami"][i],
          source: sources[i],
          stage: stages[i],
        },
      })
    }

    const finalCounts = {
      agents: Object.keys(agentMap).length,
      properties: PROPERTIES.length,
      leads: 4,
    }

    return NextResponse.json({
      ok: true,
      message: `Database seeded successfully. ${finalCounts.agents} agents, ${finalCounts.properties} properties, and ${finalCounts.leads} sample leads added.`,
      counts: finalCounts,
    })
  } catch (e) {
    // Log the real error server-side, return a generic message to the client
    // so we don't leak Prisma connection details or table names.
    console.error("[admin/setup] seed failed:", e)
    return NextResponse.json(
      { error: "Setup failed. Check the server logs for details.", code: "SETUP_FAILED" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const [agents, properties, leads] = await Promise.all([
      db.agent.count(),
      db.property.count(),
      db.lead.count(),
    ])
    return NextResponse.json({
      connected: true,
      seeded: agents > 0,
      counts: { agents, properties, leads },
    })
  } catch (e) {
    console.error("[admin/setup] connection check failed:", e)
    return NextResponse.json({
      connected: false,
      error: "Cannot connect to the database. Check your DATABASE_URL and try again.",
    })
  }
}
