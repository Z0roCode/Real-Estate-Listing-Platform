/**
 * Seed for Z0roCode Estates.
 * Run: bun run prisma/seed.ts
 *
 * 5 agents with real portrait photos, 18 listings across 10 cities with slugs,
 * view counts, nearby places, and property history. Plus a few sample leads,
 * appointments and notifications so the admin board looks alive.
 */
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

const AGENTS = [
  {
    name: "Elena Vasquez",
    title: "Senior Buyer's Agent",
    specialty: "Austin's neighborhoods, memorized.",
    bio: "Elena has helped over 300 families find their footing in Austin over the last decade. She knows which streets flood, which schools feed where, and which homes are fairly priced the moment they hit the market. She treats every buyer like family, which means she is honest when a home is not the one.",
    email: "elena@z0rocode.com",
    phone: "(512) 555-0142",
    photo: "https://sfile.chatglm.cn/images-ppt/888e2f600ce4.jpg",
    city: "Austin",
    focusAreas: ["Barton Hills", "Zilker", "Cherrywood", "Mueller"],
    soldCount: 312,
    rating: 4.9,
    slug: "elena-vasquez",
  },
  {
    name: "Marcus Chen",
    title: "Luxury Specialist",
    specialty: "Homes over $2M, handled with care.",
    bio: "Marcus specializes in luxury and waterfront properties across Miami and the West Coast. Before real estate he ran a design studio, so he reads a home the way an architect does. His clients value discretion, and he delivers it. Every detail of a high-end transaction, from staging to closing, is handled quietly and well.",
    email: "marcus@z0rocode.com",
    phone: "(415) 555-0188",
    photo: "https://sfile.chatglm.cn/images-ppt/b1dce3f9ed9b.jpg",
    city: "Miami",
    focusAreas: ["Miami Beach", "Waterfront", "Luxury Condos", "Hillsborough"],
    soldCount: 184,
    rating: 5.0,
    slug: "marcus-chen",
  },
  {
    name: "Priya Patel",
    title: "Listing Agent",
    specialty: "Pricing that holds up under scrutiny.",
    bio: "Priya lists homes and sells them for the number she says she will. Her pricing is built on comps, condition, and current demand, never on wishful thinking. Sellers get a clear plan, weekly updates, and a negotiator who treats their equity like her own. She has listed and sold over 400 homes across Seattle and the Bay Area.",
    email: "priya@z0rocode.com",
    phone: "(206) 555-0173",
    photo: "https://sfile.chatglm.cn/images-ppt/27388b9df998.png",
    city: "Seattle",
    focusAreas: ["Capitol Hill", "Ballard", "West Seattle", "Bellevue"],
    soldCount: 406,
    rating: 4.9,
    slug: "priya-patel",
  },
  {
    name: "James O'Brien",
    title: "First-Time Buyer Guide",
    specialty: "Patient, clear, and on your side.",
    bio: "James works with first-time buyers, and he loves it. He knows the process feels overwhelming, so he slows it down and explains every step. No question is too small, no concern brushed off. By the time you close, you will understand exactly what you bought and why. Hundreds of first-time buyers have started their story with a call to James.",
    email: "james@z0rocode.com",
    phone: "(312) 555-0119",
    photo: "https://sfile.chatglm.cn/images-ppt/51ff1eb439c0.jpg",
    city: "Chicago",
    focusAreas: ["Lincoln Park", "Logan Square", "River North", "Pilsen"],
    soldCount: 258,
    rating: 4.8,
    slug: "james-obrien",
  },
  {
    name: "Sofia Romano",
    title: "Investment Advisor",
    specialty: "Numbers first, emotion second.",
    bio: "Sofia works with investors and second-home buyers who want a clear return story. She models cash flow, appreciation, and exit options before she ever shows a property. Her clients are disciplined, and so is she. If a deal does not pencil, she will say so. That honesty has built a referral business that keeps her busy year round.",
    email: "sofia@z0rocode.com",
    phone: "(305) 555-0166",
    photo: "https://sfile.chatglm.cn/images-ppt/27c842c69a3e.jpg",
    city: "Nashville",
    focusAreas: ["12South", "East Nashville", "Germantown", "Downtown"],
    soldCount: 201,
    rating: 4.9,
    slug: "sofia-romano",
  },
]

const EXTERIOR = {
  modern: [
    "https://sfile.chatglm.cn/images-ppt/3c1d82ffa132.png",
    "https://sfile.chatglm.cn/images-ppt/adb69aa368c0.jpg",
    "https://sfile.chatglm.cn/images-ppt/b950784e638d.jpg",
    "https://sfile.chatglm.cn/images-ppt/f8f834049ea4.jpg",
    "https://sfile.chatglm.cn/images-ppt/8a597f80cd5c.jpg",
    "https://sfile.chatglm.cn/images-ppt/1062749b0b19.png",
    "https://sfile.chatglm.cn/images-ppt/c1dfdbbd6d4b.jpg",
    "https://sfile.chatglm.cn/images-ppt/0bf40fc2d4eb.jpg",
  ],
  craftsman: [
    "https://sfile.chatglm.cn/images-ppt/fb823fa5177b.jpg",
    "https://sfile.chatglm.cn/images-ppt/931d33bb6e17.jpg",
    "https://sfile.chatglm.cn/images-ppt/ee0e406ac866.jpg",
    "https://sfile.chatglm.cn/images-ppt/02939a105c11.jpg",
    "https://sfile.chatglm.cn/images-ppt/4777064f55e7.jpg",
  ],
  apartment: [
    "https://sfile.chatglm.cn/images-ppt/121f2d37c8c2.jpg",
    "https://sfile.chatglm.cn/images-ppt/f5851648e8d1.jpg",
    "https://sfile.chatglm.cn/images-ppt/b8867f0968a8.jpeg",
    "https://sfile.chatglm.cn/images-ppt/18cd083cbaaf.jpg",
    "https://sfile.chatglm.cn/images-ppt/60e5676e1414.jpeg",
    "https://sfile.chatglm.cn/images-ppt/5bc4722b8dd7.jpg",
  ],
  townhouse: [
    "https://sfile.chatglm.cn/images-ppt/eb1153c193cb.jpg",
    "https://sfile.chatglm.cn/images-ppt/133d2e98b006.jpg",
    "https://sfile.chatglm.cn/images-ppt/d4ca87fcd5cc.jpg",
    "https://sfile.chatglm.cn/images-ppt/c0b36b1ef838.jpg",
    "https://sfile.chatglm.cn/images-ppt/bb0c036f18dc.jpg",
  ],
}

const LIVING = [
  "https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg",
  "https://sfile.chatglm.cn/images-ppt/dcedff8c9d17.jpg",
  "https://sfile.chatglm.cn/images-ppt/85a1fdd0e25b.jpg",
  "https://sfile.chatglm.cn/images-ppt/88f6b6f22d0e.jpg",
  "https://sfile.chatglm.cn/images-ppt/f52b0c97f509.jpg",
  "https://sfile.chatglm.cn/images-ppt/348ef2d80895.jpg",
  "https://sfile.chatglm.cn/images-ppt/e14265f04256.jpg",
  "https://sfile.chatglm.cn/images-ppt/17472395e4b3.jpg",
  "https://sfile.chatglm.cn/images-ppt/c9847eddf48c.jpg",
  "https://sfile.chatglm.cn/images-ppt/d495488e251a.jpg",
  "https://sfile.chatglm.cn/images-ppt/a27e54f78237.jpg",
]
const KITCHEN = [
  "https://sfile.chatglm.cn/images-ppt/881392c04080.jpg",
  "https://sfile.chatglm.cn/images-ppt/2a30272fb97c.jpg",
  "https://sfile.chatglm.cn/images-ppt/9349ea733841.png",
  "https://sfile.chatglm.cn/images-ppt/9b6a7eeaa0d0.jpg",
  "https://sfile.chatglm.cn/images-ppt/d3f9a730f839.jpg",
  "https://sfile.chatglm.cn/images-ppt/596b1b3f3bc0.png",
  "https://sfile.chatglm.cn/images-ppt/d46786414bcd.jpg",
  "https://sfile.chatglm.cn/images-ppt/209992a85a5f.jpg",
  "https://sfile.chatglm.cn/images-ppt/217943ca14da.jpg",
  "https://sfile.chatglm.cn/images-ppt/a52d902ff8a3.jpg",
]
const BEDROOM = [
  "https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg",
  "https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg",
  "https://sfile.chatglm.cn/images-ppt/08442f1a2001.jpg",
  "https://sfile.chatglm.cn/images-ppt/e90d4e7ca5b0.jpg",
  "https://sfile.chatglm.cn/images-ppt/dbeacc4a0ba7.jpg",
  "https://sfile.chatglm.cn/images-ppt/80b7c8d48b62.jpg",
  "https://sfile.chatglm.cn/images-ppt/c1883a185ff6.jpg",
  "https://sfile.chatglm.cn/images-ppt/eec52ea81c0c.jpg",
  "https://sfile.chatglm.cn/images-ppt/1b8d8bed77c8.png",
  "https://sfile.chatglm.cn/images-ppt/a64affb21045.jpg",
  "https://sfile.chatglm.cn/images-ppt/03425d1604e8.png",
]
const BATHROOM = [
  "https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg",
  "https://sfile.chatglm.cn/images-ppt/27cc1d4c662e.jpeg",
  "https://sfile.chatglm.cn/images-ppt/2ab8eeb6f3d0.webp",
  "https://sfile.chatglm.cn/images-ppt/fe69bc224895.jpg",
  "https://sfile.chatglm.cn/images-ppt/a350de91c1a8.jpg",
  "https://sfile.chatglm.cn/images-ppt/fee3b9f27e6c.jpg",
  "https://sfile.chatglm.cn/images-ppt/579065c84c53.jpg",
  "https://sfile.chatglm.cn/images-ppt/b2a750c09918.jpg",
]
const POOL = [
  "https://sfile.chatglm.cn/images-ppt/6f784eae8ade.jpeg",
  "https://sfile.chatglm.cn/images-ppt/6e2b040b29ad.jpg",
  "https://sfile.chatglm.cn/images-ppt/01dddcab2ed1.jpg",
  "https://sfile.chatglm.cn/images-ppt/8a5393a7b9e1.jpg",
  "https://sfile.chatglm.cn/images-ppt/71cb685fb906.jpg",
]

function buildImages(exterior: string, i: number, withPool = false): string[] {
  const imgs = [
    exterior,
    LIVING[i % LIVING.length],
    KITCHEN[(i + 3) % KITCHEN.length],
    BEDROOM[i % BEDROOM.length],
    BATHROOM[(i + 2) % BATHROOM.length],
    BEDROOM[(i + 7) % BEDROOM.length],
  ]
  if (withPool) imgs.push(POOL[i % POOL.length])
  return imgs
}

function nearbyFor(city: string) {
  const map: Record<string, any> = {
    Austin: {
      schools: ["Barton Hills Elementary (9/10)", "O. Henry Middle (8/10)", "Austin High (8/10)"],
      hospitals: ["Seton Medical Center — 1.2 mi", "St. David's — 2.4 mi"],
      shopping: ["Zilker Market — 0.4 mi", "South Congress shops — 1.8 mi"],
      transit: ["Rapid 801 — 3 blocks", "Downtown — 8 min drive"],
    },
    "San Francisco": {
      schools: ["Marshall Elementary (8/10)", "Mission High (7/10)"],
      hospitals: ["ZSFGH — 1.5 mi", "UCSF Medical — 2.1 mi"],
      shopping: ["Valencia Corridor — 0.2 mi", "Mission Market — 0.6 mi"],
      transit: ["BART 16th St — 0.5 mi", "Muni 14 — 1 block"],
    },
    Seattle: {
      schools: ["Stevens Elementary (8/10)", "Garfield High (9/10)"],
      hospitals: ["Swedish — 1.1 mi", "Virginia Mason — 2.3 mi"],
      shopping: ["Broadway Market — 0.3 mi", "Pike Place — 1.9 mi"],
      transit: ["Light Rail Capitol Hill — 0.4 mi", "Downtown — 12 min"],
    },
    Chicago: {
      schools: ["Lincoln Elementary (9/10)", "Lincoln Park High (8/10)"],
      hospitals: ["Northwestern — 1.4 mi", "Rush — 2.6 mi"],
      shopping: ["Armitage Ave — 0.5 mi", "North Ave shops — 0.8 mi"],
      transit: ["Brown Line — 2 blocks", "Loop — 15 min"],
    },
    Miami: {
      schools: ["South Pointe Elementary (8/10)", "Miami Beach High (7/10)"],
      hospitals: ["Mount Sinai — 1.0 mi", "Jackson Memorial — 3.2 mi"],
      shopping: ["Lincoln Road — 1.2 mi", "Sunset Harbour — 0.8 mi"],
      transit: ["South Beach Local — 1 block", "Airport — 25 min"],
    },
    Denver: {
      schools: ["Steck Elementary (8/10)", "East High (8/10)"],
      hospitals: ["Presbyterian St. Lukes — 1.8 mi", "UCHealth — 2.4 mi"],
      shopping: ["Cherry Creek North — 0.6 mi", "3rd Ave shops — 0.9 mi"],
      transit: ["Bus 10 — 1 block", "Downtown — 10 min"],
    },
    Brooklyn: {
      schools: ["PS 261 (8/10)", "MS 447 (8/10)"],
      hospitals: ["Methodist — 1.2 mi", "NYU Langone — 2.0 mi"],
      shopping: ["Court St — 0.1 mi", "Atlantic Terminal — 0.8 mi"],
      transit: ["F/G Bergen — 2 blocks", "Manhattan — 20 min"],
    },
    "Round Rock": {
      schools: ["Cactus Ranch Elementary (9/10)", "Westwood High (9/10)"],
      hospitals: ["Seton Williamson — 3.1 mi", "St. David's Round Rock — 2.4 mi"],
      shopping: ["The Domain — 4.5 mi", "Dell Diamond area — 2.0 mi"],
      transit: ["I-35 access — 1 mi", "Downtown Austin — 20 min"],
    },
    Glendale: {
      schools: ["R.D. White Elementary (8/10)", "Glendale High (7/10)"],
      hospitals: ["Glendale Memorial — 1.6 mi", "USC Verdugo Hills — 2.2 mi"],
      shopping: ["Brand Blvd — 0.7 mi", "Americana — 1.1 mi"],
      transit: ["Beeline Bus — 2 blocks", "Downtown LA — 20 min"],
    },
    Savannah: {
      schools: ["Hesse Elementary (7/10)", "Beach High (6/10)"],
      hospitals: ["Memorial Health — 1.4 mi", "St. Joseph's — 2.8 mi"],
      shopping: ["Broughton St — 0.3 mi", "City Market — 0.5 mi"],
      transit: ["CAT bus — 1 block", "Tybee Island — 25 min"],
    },
    Phoenix: {
      schools: ["Basis Ahwatukee (10/10)", "Desert Vista High (9/10)"],
      hospitals: ["Banner Desert — 3.2 mi", "Dignity Health — 2.6 mi"],
      shopping: ["Ahwatukee Foothills — 1.0 mi", "Arizona Mills — 3.4 mi"],
      transit: ["Valley Metro 56 — 2 blocks", "Airport — 18 min"],
    },
    Portland: {
      schools: ["Chapman Elementary (8/10)", "Lincoln High (8/10)"],
      hospitals: ["OHSU — 1.9 mi", "Providence — 1.4 mi"],
      shopping: ["Pearl District — 0.1 mi", "Powell's — 0.3 mi"],
      transit: ["Streetcar — 1 block", "Downtown — 5 min"],
    },
    Nashville: {
      schools: ["Glendale Elementary (8/10)", "Hillsboro High (7/10)"],
      hospitals: ["Vanderbilt — 2.1 mi", "St. Thomas — 1.8 mi"],
      shopping: ["12South — 0.1 mi", "Green Hills — 1.6 mi"],
      transit: ["Bus 17 — 1 block", "Downtown — 8 min"],
    },
    Plano: {
      schools: ["Barksdale Elementary (10/10)", "Plano West High (9/10)"],
      hospitals: ["Texas Health Plano — 2.3 mi", "Medical City — 3.0 mi"],
      shopping: ["Legacy West — 2.1 mi", "Shops at Legacy — 1.4 mi"],
      transit: ["DART — 1.2 mi", "Downtown Dallas — 30 min"],
    },
    "New York": {
      schools: ["PS 183 (9/10)", "Eleanor Roosevelt (8/10)"],
      hospitals: ["Lenox Hill — 1.1 mi", "NYU Langone — 1.6 mi"],
      shopping: ["86th St — 0.2 mi", "Madison Ave — 2 blocks"],
      transit: ["4/5/6 at 86th — 0.2 mi", "Midtown — 15 min"],
    },
    Boulder: {
      schools: ["Foothill Elementary (9/10)", "Boulder High (8/10)"],
      hospitals: ["Boulder Community — 4.2 mi", "Avista — 5.1 mi"],
      shopping: ["Pearl Street — 6 mi", "Twenty Ninth St — 5.5 mi"],
      transit: ["Bolt Bus — 1 mi", "Denver — 40 min"],
    },
  }
  return JSON.stringify(map[city] ?? map.Austin)
}

interface SeedProperty {
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  lotSize?: number
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  type: "House" | "Apartment" | "Condo" | "Townhouse" | "Loft"
  status: "For Sale" | "Pending" | "Sold"
  yearBuilt: number
  features: string[]
  amenities: string[]
  energyRating?: string
  agentSlug: string
  exterior: string
  withPool?: boolean
  featured?: boolean
  views?: number
}

const PROPERTIES: SeedProperty[] = [
  {
    title: "Modern Hillside Retreat with Pool",
    description:
      "Wake up to wide hilltop views every morning. This four-bedroom home is built for real life, with an open kitchen at the center, a living room that flows straight onto the deck, and a primary suite tucked away like a private retreat. A pool, a media room, and solar panels make the weekends easy and the bills small.",
    price: 1850000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3650,
    lotSize: 0.42,
    address: "2408 Ridgeline Dr",
    city: "Austin",
    state: "TX",
    zip: "78704",
    latitude: 30.2549,
    longitude: -97.7891,
    type: "House",
    status: "For Sale",
    yearBuilt: 2021,
    features: ["Hilltop views", "Kitchen built for gathering", "Primary suite wing", "Media room", "Swimming pool", "Solar panels", "2-car garage"],
    amenities: ["Pool", "Solar", "Media room", "EV charger", "Smart home"],
    energyRating: "A",
    agentSlug: "elena-vasquez",
    exterior: EXTERIOR.modern[0],
    withPool: true,
    featured: true,
    views: 412,
  },
  {
    title: "Sunny Mission District Condo",
    description:
      "Morning coffee on your own south-facing patio. This ground-floor condo keeps the character of 1920s San Francisco with modern updates where it counts, a refreshed kitchen, two roomy bedrooms, and in-unit laundry. Step out to cafés, taquerias, and parks within a few blocks.",
    price: 899000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1180,
    address: "744 Valencia St, Unit 1",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
    latitude: 37.7599,
    longitude: -122.4214,
    type: "Condo",
    status: "For Sale",
    yearBuilt: 1924,
    features: ["Private patio", "In-unit laundry", "Dedicated parking", "Updated kitchen", "Walk to cafés", "Pet friendly"],
    amenities: ["Parking", "Laundry", "Storage", "Pet friendly"],
    energyRating: "C",
    agentSlug: "marcus-chen",
    exterior: EXTERIOR.apartment[0],
    views: 289,
  },
  {
    title: "Craftsman Bungalow in Capitol Hill",
    description:
      "Real Craftsman character, lovingly kept. Original millwork, a cozy fireplace, and a flowing layout make this 1912 bungalow feel like home the moment you walk in. The finished basement adds a family room and fourth bedroom, and the fenced backyard is ready for summer evenings.",
    price: 1125000,
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2480,
    lotSize: 0.12,
    address: "518 12th Ave E",
    city: "Seattle",
    state: "WA",
    zip: "98102",
    latitude: 47.6232,
    longitude: -122.3197,
    type: "House",
    status: "For Sale",
    yearBuilt: 1912,
    features: ["Original millwork", "Wood-burning fireplace", "Finished basement", "Fenced yard", "Detached garage", "Walk to light rail"],
    amenities: ["Fireplace", "Garage", "Garden", "Basement"],
    energyRating: "D",
    agentSlug: "priya-patel",
    exterior: EXTERIOR.craftsman[0],
    featured: true,
    views: 503,
  },
  {
    title: "Industrial Loft in River North",
    description:
      "14-foot ceilings, exposed brick, and beams that tell the building's story. This true loft gives you one big, light-filled space to make your own, with a kitchen built for cooking and a bedroom alcove for privacy. A roof deck and gym round out the building.",
    price: 425000,
    bedrooms: 1,
    bathrooms: 1.5,
    sqft: 1240,
    address: "712 N Wells St, Loft 4B",
    city: "Chicago",
    state: "IL",
    zip: "60654",
    latitude: 41.8939,
    longitude: -87.6344,
    type: "Loft",
    status: "For Sale",
    yearBuilt: 1908,
    features: ["14ft ceilings", "Exposed brick", "Timber beams", "Roof deck", "Fitness center", "Bike room"],
    amenities: ["Roof deck", "Gym", "Bike room", "Doorman"],
    energyRating: "C",
    agentSlug: "james-obrien",
    exterior: EXTERIOR.apartment[1],
    views: 178,
  },
  {
    title: "Waterfront Modern with Infinity Pool",
    description:
      "The bay is your backyard. Walls of glass slide open to a 60-foot infinity pool, so the view never leaves the frame. Six bedrooms, a summer kitchen, a wine room, and a private dock make this the kind of place you never want to leave.",
    price: 4250000,
    bedrooms: 6,
    bathrooms: 5.5,
    sqft: 6200,
    lotSize: 0.55,
    address: "2280 Bay View Ln",
    city: "Miami",
    state: "FL",
    zip: "33139",
    latitude: 25.7911,
    longitude: -80.1378,
    type: "House",
    status: "For Sale",
    yearBuilt: 2019,
    features: ["Bay frontage", "60ft infinity pool", "Summer kitchen", "Wine room", "Home theater", "Private dock"],
    amenities: ["Pool", "Dock", "Wine room", "Theater", "Smart home", "Garage"],
    energyRating: "A",
    agentSlug: "marcus-chen",
    exterior: EXTERIOR.modern[1],
    withPool: true,
    featured: true,
    views: 731,
  },
  {
    title: "Turnkey Townhouse Near Cherry Creek",
    description:
      "Three finished levels, nothing to fix. The main floor is open and bright with a gas fireplace and a kitchen built for entertaining. Upstairs, the primary suite has its own deck, and the rooftop catches the mountain sunset every night.",
    price: 749900,
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1960,
    address: "430 Garfield St",
    city: "Denver",
    state: "CO",
    zip: "80206",
    latitude: 39.7176,
    longitude: -104.9531,
    type: "Townhouse",
    status: "For Sale",
    yearBuilt: 2018,
    features: ["Rooftop deck", "Gas fireplace", "Walk-in pantry", "Mountain views", "Attached 2-car garage"],
    amenities: ["Roof deck", "Garage", "Fireplace", "Smart home"],
    energyRating: "B",
    agentSlug: "elena-vasquez",
    exterior: EXTERIOR.townhouse[0],
    views: 244,
  },
  {
    title: "Bright Brooklyn One-Bedroom with Office",
    description:
      "A bright corner unit with room for a home office. South-facing windows fill the living room with morning sun, the kitchen has been freshly updated, and the bedroom fits a king set with room to spare. A 24-hour doorman and roof deck make city living easy.",
    price: 615000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 760,
    address: "150 Court St, Apt 5F",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    latitude: 40.6883,
    longitude: -73.9949,
    type: "Apartment",
    status: "Pending",
    yearBuilt: 1965,
    features: ["Corner unit", "Home office nook", "24hr doorman", "Fitness center", "Roof deck", "Elevator"],
    amenities: ["Doorman", "Gym", "Roof deck", "Laundry", "Elevator"],
    energyRating: "C",
    agentSlug: "james-obrien",
    exterior: EXTERIOR.apartment[2],
    views: 367,
  },
  {
    title: "Family Home on a Quiet Cul-de-Sac",
    description:
      "Quiet street, no through traffic, nothing to do but move in. Four bedrooms, a study, and an open kitchen-family room make this a natural fit for daily family life. The backyard is already landscaped with a covered patio for evening dinners.",
    price: 685000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2940,
    lotSize: 0.18,
    address: "1124 Willow Bend Ct",
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    latitude: 30.5083,
    longitude: -97.6789,
    type: "House",
    status: "For Sale",
    yearBuilt: 2020,
    features: ["Cul-de-sac", "Main-floor study", "Walk-in pantry", "Covered patio", "Landscaped yard", "3-car garage"],
    amenities: ["Garage", "Patio", "Garden", "Smart home"],
    energyRating: "A",
    agentSlug: "elena-vasquez",
    exterior: EXTERIOR.modern[2],
    views: 198,
  },
  {
    title: "Penthouse Condo with Skyline Views",
    description:
      "Floor-to-ceiling windows on every wall, with downtown and mountain views that change with the light. The kitchen is sleek and modern, the primary bath feels like a spa, and a 400-square-foot terrace extends the living room outside. Two parking spaces included.",
    price: 1295000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1720,
    address: "1430 Larimer St, PH 31",
    city: "Denver",
    state: "CO",
    zip: "80202",
    latitude: 39.7495,
    longitude: -104.9923,
    type: "Condo",
    status: "For Sale",
    yearBuilt: 2017,
    features: ["Penthouse level", "Skyline views", "400 sqft terrace", "Spa bath", "2 parking spaces", "Concierge"],
    amenities: ["Concierge", "Gym", "Terrace", "Parking", "Doorman"],
    energyRating: "B",
    agentSlug: "sofia-romano",
    exterior: EXTERIOR.apartment[3],
    featured: true,
    views: 521,
  },
  {
    title: "Mid-Century Gem on Oversized Lot",
    description:
      "Mid-century charm, fully updated. Vaulted beams, a sunken living room, and walls of clerestory windows give this home a one-of-a-kind feel. The kitchen and baths have been modernized while keeping the original character, and the nearly quarter-acre lot is privately hedged.",
    price: 1395000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1980,
    lotSize: 0.24,
    address: "1820 Chevy Chase Dr",
    city: "Glendale",
    state: "CA",
    zip: "91206",
    latitude: 34.1533,
    longitude: -118.2541,
    type: "House",
    status: "Pending",
    yearBuilt: 1959,
    features: ["Mid-century character", "Vaulted ceilings", "Clerestory windows", "Updated kitchen", "Oversized lot", "ADU potential"],
    amenities: ["Garden", "Patio", "Garage", "Fireplace"],
    energyRating: "C",
    agentSlug: "marcus-chen",
    exterior: EXTERIOR.craftsman[1],
    views: 312,
  },
  {
    title: "Garden Apartment in Historic Savannah",
    description:
      "Live on one of Savannah's prettiest squares. This garden apartment has high ceilings, heart-pine floors, and original fireplaces, with a private entry opening to a shared courtyard. Off-street parking is included, a rare find here.",
    price: 379000,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1050,
    address: "12 W Gordon St, Unit G",
    city: "Savannah",
    state: "GA",
    zip: "31401",
    latitude: 32.0712,
    longitude: -81.0946,
    type: "Apartment",
    status: "For Sale",
    yearBuilt: 1892,
    features: ["Historic brownstone", "Original fireplaces", "Heart-pine floors", "Private entry", "Shared courtyard", "Off-street parking"],
    amenities: ["Parking", "Courtyard", "Fireplace"],
    energyRating: "D",
    agentSlug: "james-obrien",
    exterior: EXTERIOR.apartment[4],
    views: 156,
  },
  {
    title: "Family Home with Pool and Sport Court",
    description:
      "Built for an active family. Five bedrooms, a sport court, a pebble-tec pool, and a covered patio make this a home the kids will never want to leave. The open kitchen and family room are the heart of the house, in a top-rated school zone.",
    price: 965000,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3850,
    lotSize: 0.34,
    address: "8820 S Maroon Peak Ave",
    city: "Phoenix",
    state: "AZ",
    zip: "85048",
    latitude: 33.3062,
    longitude: -111.9751,
    type: "House",
    status: "For Sale",
    yearBuilt: 2015,
    features: ["Sport court", "Pebble-tec pool", "Covered patio", "Top school zone", "Walk-in pantry", "3-car garage"],
    amenities: ["Pool", "Sport court", "Patio", "Garage", "Smart home"],
    energyRating: "A",
    agentSlug: "elena-vasquez",
    exterior: EXTERIOR.modern[3],
    withPool: true,
    views: 287,
  },
  {
    title: "Pearl District Warehouse Loft",
    description:
      "Authentic warehouse conversion in the heart of the Pearl. Soaring ceilings, oversized windows, and polished concrete floors set a modern tone. The bedroom is tucked behind a partial wall for privacy. Some of the city's best food and coffee is literally downstairs.",
    price: 489000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 940,
    address: "1022 NW Lovejoy St, #210",
    city: "Portland",
    state: "OR",
    zip: "97209",
    latitude: 45.5301,
    longitude: -122.6849,
    type: "Loft",
    status: "For Sale",
    yearBuilt: 1923,
    features: ["Warehouse conversion", "Polished concrete", "Rain shower", "Walk to streetcar", "Bike storage"],
    amenities: ["Bike room", "Storage", "Elevator"],
    energyRating: "C",
    agentSlug: "priya-patel",
    exterior: EXTERIOR.townhouse[2],
    views: 203,
  },
  {
    title: "Nashville Townhouse with Roof Deck",
    description:
      "Two blocks from the bistros and boutiques of 12South. This three-bedroom townhouse has wide-plank floors, a gas fireplace, and a kitchen with a walk-in pantry. The primary suite takes the top floor, with a private roof deck for sunset drinks.",
    price: 829000,
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2210,
    address: "2304 12th Ave S",
    city: "Nashville",
    state: "TN",
    zip: "37204",
    latitude: 36.1349,
    longitude: -86.7856,
    type: "Townhouse",
    status: "For Sale",
    yearBuilt: 2019,
    features: ["Roof deck", "Gas fireplace", "Walk-in pantry", "Media room", "Custom closets", "Attached garage"],
    amenities: ["Roof deck", "Garage", "Fireplace", "Media room"],
    energyRating: "B",
    agentSlug: "sofia-romano",
    exterior: EXTERIOR.townhouse[1],
    featured: true,
    views: 345,
  },
  {
    title: "Renovated Ranch on Quiet Street",
    description:
      "Down to the studs in 2022, with a new roof, new HVAC, and new windows. This single-story ranch now has an open great room, a kitchen with a big island, and four well-proportioned bedrooms. The backyard is fully fenced with a covered patio. Nothing to do but unpack.",
    price: 548000,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 2010,
    lotSize: 0.2,
    address: "6702 Ashford Dr",
    city: "Plano",
    state: "TX",
    zip: "75093",
    latitude: 33.0347,
    longitude: -96.7858,
    type: "House",
    status: "Sold",
    yearBuilt: 1986,
    features: ["Fully renovated", "Single story", "New roof & HVAC", "Walk-in shower", "Fenced yard", "2-car garage"],
    amenities: ["Garage", "Patio", "Garden", "Fireplace"],
    energyRating: "A",
    agentSlug: "elena-vasquez",
    exterior: EXTERIOR.craftsman[2],
    views: 412,
  },
  {
    title: "Studio with Balcony and River Views",
    description:
      "A smart studio with a private balcony and river views. The layout gives you a defined sleeping alcove, the kitchen has a breakfast bar, and the bath has a glass shower. A 24-hour doorman, gym, and lounge make this an easy, low-maintenance city home.",
    price: 345000,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 510,
    address: "401 E 80th St, Apt 24C",
    city: "New York",
    state: "NY",
    zip: "10075",
    latitude: 40.7706,
    longitude: -73.9498,
    type: "Apartment",
    status: "For Sale",
    yearBuilt: 1978,
    features: ["River views", "Private balcony", "24hr doorman", "Residents' lounge", "Fitness center", "Elevator"],
    amenities: ["Doorman", "Gym", "Lounge", "Laundry", "Elevator"],
    energyRating: "C",
    agentSlug: "james-obrien",
    exterior: EXTERIOR.apartment[5],
    views: 167,
  },
  {
    title: "Mountain-View Contemporary on Acreage",
    description:
      "Set on 1.6 acres of pines, with the peaks filling every window. The vaulted great room has a stone fireplace that runs floor to ceiling, and the wraparound deck is built for morning coffee and evening stars. A walk-out lower level adds a guest suite and rec room.",
    price: 1075000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3280,
    lotSize: 1.6,
    address: "9400 Snowmass Creek Rd",
    city: "Boulder",
    state: "CO",
    zip: "80302",
    latitude: 40.0301,
    longitude: -105.2848,
    type: "House",
    status: "For Sale",
    yearBuilt: 2014,
    features: ["1.6 acres", "Mountain views", "Floor-to-ceiling fireplace", "Walk-out basement", "Wraparound deck", "Hot tub"],
    amenities: ["Hot tub", "Deck", "Fireplace", "Garage", "Acreage"],
    energyRating: "B",
    agentSlug: "sofia-romano",
    exterior: EXTERIOR.modern[4],
    views: 378,
  },
  {
    title: "Solar-Powered Home in Eco Community",
    description:
      "Thoughtful design that keeps bills low. A 7kW solar array, rainwater collection, and great insulation make this one of the most efficient homes in its community. Three bedrooms, a gas-range kitchen, and a walk to the community pool and trails.",
    price: 612000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1860,
    lotSize: 0.09,
    address: "4210 Whispering Valley Dr",
    city: "Austin",
    state: "TX",
    zip: "78748",
    latitude: 30.1621,
    longitude: -97.8004,
    type: "House",
    status: "For Sale",
    yearBuilt: 2017,
    features: ["Solar panels", "Rainwater collection", "Walk to pool & trails", "Gas range", "Community garden", "Energy efficient"],
    amenities: ["Solar", "Garden", "Community pool", "Garage"],
    energyRating: "A",
    agentSlug: "elena-vasquez",
    exterior: EXTERIOR.modern[5],
    views: 224,
  },
]

async function main() {
  console.log("Clearing existing data...")
  await db.notification.deleteMany()
  await db.appointment.deleteMany()
  await db.lead.deleteMany()
  await db.inquiry.deleteMany()
  await db.savedProperty.deleteMany()
  await db.user.deleteMany()
  await db.property.deleteMany()
  await db.agent.deleteMany()

  console.log("Seeding agents...")
  const agentMap: Record<string, string> = {}
  for (const a of AGENTS) {
    const ag = await db.agent.create({
      data: {
        ...a,
        focusAreas: JSON.stringify(a.focusAreas),
      },
    })
    agentMap[a.slug] = ag.id
  }

  console.log(`Seeding ${PROPERTIES.length} properties...`)
  for (let i = 0; i < PROPERTIES.length; i++) {
    const p = PROPERTIES[i]
    const images = buildImages(p.exterior, i, p.withPool)
    const agentId = agentMap[p.agentSlug]
    const daysAgo = Math.floor(Math.random() * 45) + 2
    const listedDate = new Date(Date.now() - daysAgo * 86400000)
    const history = JSON.stringify([
      { date: listedDate.toISOString().slice(0, 10), event: "Listed for sale", price: p.price },
      ...(p.status === "Sold"
        ? [{ date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10), event: "Sold", price: Math.round(p.price * 0.98) }]
        : []),
      { date: new Date(Date.now() - 120 * 86400000).toISOString().slice(0, 10), event: "Price reduced", price: Math.round(p.price * 1.03) },
    ])
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
        energyRating: p.energyRating ?? null,
        images: JSON.stringify(images),
        features: JSON.stringify(p.features),
        amenities: JSON.stringify(p.amenities),
        nearby: nearbyFor(p.city),
        history,
        agentId,
        featured: p.featured ?? false,
        approved: true,
        views: p.views ?? Math.floor(Math.random() * 200) + 50,
        createdAt: listedDate,
      },
    })
  }

  console.log("Seeding sample leads, appointments, notifications...")
  const leadSources = ["homepage", "signup", "valuation", "insights", "contact"]
  const stages = ["new", "contacted", "consultation", "client", "won", "lost"]
  const names = [
    "Jordan Avery", "Riley Thompson", "Casey Brooks", "Morgan Lee", "Sam Patel",
    "Taylor Reed", "Drew Kennedy", "Avery Stone", "Quinn Murphy", "Skyler Cruz",
  ]
  for (let i = 0; i < 10; i++) {
    await db.lead.create({
      data: {
        name: names[i],
        email: names[i].toLowerCase().replace(/\s+/g, ".") + "@example.com",
        phone: `(555) 555-${String(1000 + i).slice(-4)}`,
        intent: i % 2 === 0 ? "buying" : "selling",
        budget: [400000, 650000, 900000, 1300000, 2100000][i % 5],
        city: ["Austin", "Denver", "Seattle", "Miami", "Nashville"][i % 5],
        timeline: ["1-3 months", "3-6 months", "6+ months"][i % 3],
        source: leadSources[i % leadSources.length],
        stage: stages[i % stages.length],
        createdAt: new Date(Date.now() - i * 86400000 * 2),
      },
    })
  }

  // sample appointments
  const tomorrow = new Date(Date.now() + 86400000)
  for (let i = 0; i < 4; i++) {
    const d = new Date(tomorrow)
    d.setDate(d.getDate() + i)
    await db.appointment.create({
      data: {
        name: names[i],
        email: names[i].toLowerCase().replace(/\s+/g, ".") + "@example.com",
        phone: `(555) 555-${String(2000 + i).slice(-4)}`,
        date: d.toISOString().slice(0, 10),
        time: ["10:00", "14:00", "16:30", "11:00"][i],
        type: ["video", "phone", "office", "video"][i],
      },
    })
  }

  // sample notification (stands in for an email)
  await db.notification.create({
    data: {
      type: "email",
      recipient: "admin@z0rocode.com",
      subject: "New consultation request from Jordan Avery",
      body: "Jordan Avery booked a video consultation for tomorrow at 10:00. Intent: buying. Budget: $400,000.",
      refType: "appointment",
    },
  })

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
