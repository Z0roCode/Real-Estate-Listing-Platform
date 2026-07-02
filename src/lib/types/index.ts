/**
 * Shared domain types — safe to import on the client without @prisma/client.
 * The API layer serializes Prisma rows into these shapes.
 */

export type PropertyType = "House" | "Apartment" | "Condo" | "Townhouse" | "Loft"
export type PropertyStatus = "For Sale" | "Pending" | "Sold"
export type LeadStage = "new" | "contacted" | "consultation" | "client" | "won" | "lost"

export interface Agent {
  id: string
  name: string
  title: string
  specialty: string
  bio: string
  email: string
  phone: string
  photo: string
  city: string
  focusAreas: string[]
  soldCount: number
  rating: number
  slug: string
}

export interface NearbyPlaces {
  schools: string[]
  hospitals: string[]
  shopping: string[]
  transit: string[]
}

export interface HistoryEntry {
  date: string
  event: string
  price?: number
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  lotSize: number | null
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  type: PropertyType
  status: PropertyStatus
  yearBuilt: number | null
  energyRating: string | null
  images: string[]
  features: string[]
  amenities: string[]
  nearby: NearbyPlaces
  history: HistoryEntry[]
  agent: Agent | null
  featured: boolean
  views: number
  daysListed: number
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  intent: string | null
  budget: number | null
  city: string | null
  timeline: string | null
  source: string
  stage: LeadStage
  notes: string | null
  createdAt: string
}

export interface Appointment {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  type: string
  propertyId: string | null
  status: string
  createdAt: string
}

export interface PropertyFilters {
  q?: string
  city?: string
  type?: PropertyType | "All"
  status?: PropertyStatus | "All"
  minPrice?: number
  maxPrice?: number
  bedrooms?: number | "All"
  bathrooms?: number | "All"
  sort?: "newest" | "price-low" | "price-high" | "featured"
}

export interface OnboardingPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  intent: "buying" | "selling"
  budget?: number
  city?: string
  timeline?: string
}

export interface BookingPayload {
  name: string
  email: string
  phone: string
  date: string
  time: string
  type: "video" | "phone" | "office"
  propertyId?: string
  notes?: string
}

export interface ListPropertyPayload {
  ownerName: string
  email: string
  phone: string
  address: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  yearBuilt?: number
  expectedPrice: number
  timeline: string
  description: string
  notes?: string
}
