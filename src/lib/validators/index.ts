import { z } from "zod"

/**
 * Zod validation schemas for every public form endpoint.
 *
 * Extracted from the route handlers so the routes stay thin and the schemas
 * are reusable (e.g. the same signup schema validates the modal and the API).
 *
 * Convention: every schema ends with an optional `website` honeypot field
 * where spam protection is needed.
 */

/** Onboarding / sign-up modal. */
export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required.").max(60),
  lastName: z.string().min(1, "Last name is required.").max(60),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().max(40).optional().nullable(),
  intent: z.enum(["buying", "selling"]),
  budget: z.coerce.number().min(0).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  timeline: z.string().max(80).optional().nullable(),
  pendingSavePropertyId: z.string().optional().nullable(),
  website: z.string().max(0).optional(), // honeypot
})
export type SignupInput = z.infer<typeof signupSchema>

/** Booking modal — schedule a consultation or viewing. */
export const appointmentSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().min(7, "Enter a phone number.").max(40),
  date: z.string().min(8), // ISO date
  time: z.string().min(4),
  type: z.enum(["video", "phone", "office"]),
  propertyId: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})
export type AppointmentInput = z.infer<typeof appointmentSchema>

/** Home valuation flow. */
export const valuationSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().min(7, "Enter a phone number.").max(40),
  address: z.string().min(5, "Enter the property address.").max(200),
  city: z.string().min(2).max(80),
  type: z.string().max(40),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  area: z.coerce.number().min(100, "Enter the approximate area."),
  condition: z.enum(["excellent", "good", "fair", "needs-work"]).default("good"),
  timeline: z.string().max(80).optional().nullable(),
})
export type ValuationInput = z.infer<typeof valuationSchema>

/** List-a-property modal — seller submission. */
export const listPropertySchema = z.object({
  ownerName: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().min(7, "Enter a phone number.").max(40),
  address: z.string().min(5, "Enter the property address.").max(200),
  type: z.enum(["House", "Apartment", "Condo", "Townhouse", "Loft"]),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  area: z.coerce.number().min(100),
  yearBuilt: z.coerce.number().min(1800).max(2030).optional().nullable(),
  expectedPrice: z.coerce.number().min(10000),
  timeline: z.string().max(80),
  description: z.string().min(20, "Tell us a little about the home.").max(3000),
  notes: z.string().max(2000).optional().nullable(),
  imageUrls: z.array(z.string().url()).min(1, "Add at least one photo.").max(20),
})
export type ListPropertyInput = z.infer<typeof listPropertySchema>

/** Lightweight lead capture — newsletter, contact, market note. */
export const leadSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email("Enter a valid email.").max(120),
  phone: z.string().max(40).optional().nullable(),
  intent: z.enum(["buying", "selling", "newsletter"]).optional(),
  source: z.enum(["homepage", "insights", "contact", "footer", "valuation"]).default("homepage"),
  city: z.string().max(80).optional().nullable(),
  budget: z.coerce.number().optional().nullable(),
  message: z.string().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
})
export type LeadInput = z.infer<typeof leadSchema>

/** Admin: move a lead between pipeline stages. */
export const updateLeadSchema = z.object({
  stage: z.enum(["new", "contacted", "consultation", "client", "won", "lost"]).optional(),
  notes: z.string().max(2000).optional().nullable(),
})

/** Admin: approve / feature / change property status. */
export const updatePropertySchema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["For Sale", "Pending", "Sold"]).optional(),
})
