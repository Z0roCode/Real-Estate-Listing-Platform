import type {
  Agent,
  HistoryEntry,
  NearbyPlaces,
  Property,
} from "@/lib/types"

/** Convert a raw Prisma property row (with agent) into the client-safe shape. */
export function serializeProperty(p: any): Property {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    lotSize: p.lotSize,
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
    images: JSON.parse(p.images),
    features: JSON.parse(p.features),
    amenities: p.amenities ? JSON.parse(p.amenities) : [],
    nearby: p.nearby ? (JSON.parse(p.nearby) as NearbyPlaces) : emptyNearby(),
    history: p.history ? (JSON.parse(p.history) as HistoryEntry[]) : [],
    agent: p.agent ? serializeAgent(p.agent) : null,
    featured: p.featured,
    views: p.views,
    daysListed: Math.max(
      0,
      Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000),
    ),
    createdAt: p.createdAt.toISOString(),
  }
}

export function serializeAgent(a: any): Agent {
  return {
    id: a.id,
    name: a.name,
    title: a.title,
    specialty: a.specialty,
    bio: a.bio,
    email: a.email,
    phone: a.phone,
    photo: a.photo,
    city: a.city,
    focusAreas: JSON.parse(a.focusAreas),
    soldCount: a.soldCount,
    rating: a.rating,
    slug: a.slug,
  }
}

function emptyNearby(): NearbyPlaces {
  return { schools: [], hospitals: [], shopping: [], transit: [] }
}
