import { db } from "@/lib/db"
import { slugify } from "@/lib/helpers"
import type { SignupInput, AppointmentInput, ValuationInput, ListPropertyInput, LeadInput } from "@/lib/validators"

/**
 * Lead service — handles lead creation, pipeline tracking, and notifications.
 *
 * This is the single source of truth for "a new lead entered the system".
 * Every form endpoint (signup, booking, valuation, contact) funnels through
 * here so lead data stays consistent and the admin CRM always shows the
 * right picture.
 */

/** Condition multipliers for valuation estimates. */
const CONDITION_MULTIPLIER: Record<string, number> = {
  excellent: 1.08,
  good: 1.0,
  fair: 0.92,
  "needs-work": 0.82,
}

/** Create a lead + the standard pair of notifications (to user + to admin). */
async function createLeadWithNotifications(params: {
  name: string
  email: string
  phone?: string | null
  intent?: string | null
  budget?: number | null
  city?: string | null
  source: string
  stage?: string
  notes?: string | null
  userId?: string | null
  userEmailSubject: string
  userEmailBody: string
  adminEmailSubject: string
  adminEmailBody: string
  refType?: string
  refId?: string
}) {
  const lead = await db.lead.create({
    data: {
      userId: params.userId ?? null,
      name: params.name,
      email: params.email,
      phone: params.phone ?? null,
      intent: params.intent ?? null,
      budget: params.budget ?? null,
      city: params.city ?? null,
      source: params.source,
      stage: params.stage ?? "new",
      notes: params.notes ?? null,
    },
  })

  await db.notification.create({
    data: {
      type: "email",
      recipient: params.email,
      subject: params.userEmailSubject,
      body: params.userEmailBody,
      refType: params.refType ?? "lead",
      refId: params.refId ?? lead.id,
    },
  })
  await db.notification.create({
    data: {
      type: "internal",
      recipient: "admin@z0rocode.com",
      subject: params.adminEmailSubject,
      body: params.adminEmailBody,
      refType: params.refType ?? "lead",
      refId: params.refId ?? lead.id,
    },
  })

  return lead
}

/**
 * Sign up a new user (or update an existing one) and create a lead.
 * Used by the onboarding modal.
 */
export async function signupUser(input: SignupInput) {
  const name = `${input.firstName} ${input.lastName}`.trim()
  const email = input.email.toLowerCase()

  // upsert user by email
  const user = await db.user.upsert({
    where: { email },
    update: {
      name,
      phone: input.phone ?? null,
      intent: input.intent,
      budget: input.budget ?? null,
      preferredCity: input.city ?? null,
      timeline: input.timeline ?? null,
      role: "client",
    },
    create: {
      email,
      name,
      phone: input.phone ?? null,
      role: "client",
      intent: input.intent,
      budget: input.budget ?? null,
      preferredCity: input.city ?? null,
      timeline: input.timeline ?? null,
    },
  })

  // create lead + notifications
  await createLeadWithNotifications({
    name,
    email: user.email,
    phone: input.phone,
    intent: input.intent,
    budget: input.budget,
    city: input.city,
    source: "signup",
    userId: user.id,
    userEmailSubject: `Welcome to Z0roCode, ${input.firstName}`,
    userEmailBody: `Thanks for joining. Your dashboard is ready. An agent will reach out within one business day about your ${input.intent} goals.`,
    adminEmailSubject: `New ${input.intent} lead: ${name}`,
    adminEmailBody: `${name} (${email}) signed up. Budget ${input.budget ?? "n/a"}, city ${input.city ?? "n/a"}, timeline ${input.timeline ?? "n/a"}.`,
  })

  // apply a pending save if the signup came from "save this home"
  if (input.pendingSavePropertyId) {
    await db.savedProperty
      .upsert({
        where: { userId_propertyId: { userId: user.id, propertyId: input.pendingSavePropertyId } },
        update: {},
        create: { userId: user.id, propertyId: input.pendingSavePropertyId },
      })
      .catch(() => {})
  }

  return { id: user.id, name, email: user.email }
}

/**
 * Book a consultation. Checks for double-booking, creates the appointment,
 * a lead, and notifications.
 */
export async function bookAppointment(input: AppointmentInput, userId?: string | null) {
  // anti-double-booking
  const clash = await db.appointment.findFirst({
    where: { date: input.date, time: input.time, status: "confirmed" },
  })
  if (clash) {
    return { error: "conflict" as const }
  }

  const appt = await db.appointment.create({
    data: {
      userId: userId ?? null,
      propertyId: input.propertyId ?? null,
      name: input.name,
      email: input.email,
      phone: input.phone,
      date: input.date,
      time: input.time,
      type: input.type,
      notes: input.notes ?? null,
      status: "confirmed",
    },
  })

  await createLeadWithNotifications({
    name: input.name,
    email: input.email,
    phone: input.phone,
    intent: "buying",
    source: "appointment",
    stage: "consultation",
    userId,
    notes: `Booked ${input.type} consult ${input.date} ${input.time}`,
    userEmailSubject: "Your consultation is booked",
    userEmailBody: `Hi ${input.name}, you're booked for a ${input.type} consultation on ${input.date} at ${input.time}. We'll send a reminder the day before.`,
    adminEmailSubject: `New consultation: ${input.name} — ${input.date} ${input.time}`,
    adminEmailBody: `${input.name} booked a ${input.type} consultation for ${input.date} at ${input.time}. Email ${input.email}, phone ${input.phone}.`,
    refType: "appointment",
    refId: appt.id,
  })

  return { id: appt.id }
}

/**
 * Calculate a home valuation estimate from comparable sales.
 * Returns a realistic range based on median $/sqft for the city.
 */
export async function calculateValuation(input: ValuationInput) {
  const comps = await db.property.findMany({
    where: { city: input.city, status: { in: ["For Sale", "Sold"] } },
    select: { price: true, sqft: true },
  })
  const ppsfs = comps
    .filter((c) => c.sqft > 0)
    .map((c) => c.price / c.sqft)
    .sort((a, b) => a - b)
  const median = ppsfs.length ? ppsfs[Math.floor(ppsfs.length / 2)] : 350

  const mult = CONDITION_MULTIPLIER[input.condition] ?? 1
  const base = input.area * median * mult
  const low = Math.round((base * 0.95) / 1000) * 1000
  const high = Math.round((base * 1.08) / 1000) * 1000

  await createLeadWithNotifications({
    name: input.name,
    email: input.email,
    phone: input.phone,
    intent: "selling",
    source: "valuation",
    city: input.city,
    notes: `Valuation: ${input.address}, ${input.type}, ${input.bedrooms}bd/${input.bathrooms}ba, ${input.area}sqft, ${input.condition}. Estimate ${low}-${high}.`,
    userEmailSubject: `Your home estimate: $${low.toLocaleString()} – $${high.toLocaleString()}`,
    userEmailBody: `Hi ${input.name}, based on recent sales near ${input.address}, your estimated value is $${low.toLocaleString()} to $${high.toLocaleString()}. An agent will call within one business day to refine this.`,
    adminEmailSubject: `New valuation request: ${input.name} — ${input.address}`,
    adminEmailBody: `${input.name} requested a valuation for ${input.address}. Estimate ${low}-${high}. Phone ${input.phone}.`,
  })

  return { low, high }
}

/**
 * Submit a property for listing (sellers). Creates a pending property + lead.
 */
export async function submitProperty(input: ListPropertyInput) {
  const slug = `${slugify(`${input.type}-${input.address}`)}-${Math.random().toString(36).slice(2, 6)}`

  const property = await db.property.create({
    data: {
      slug,
      title: `${input.type} at ${input.address}`,
      description: input.description,
      price: input.expectedPrice,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      sqft: input.area,
      address: input.address,
      city: "Pending review",
      state: "—",
      zip: "—",
      latitude: 0,
      longitude: 0,
      type: input.type,
      status: "For Sale",
      yearBuilt: input.yearBuilt ?? null,
      images: JSON.stringify(input.imageUrls),
      features: JSON.stringify([]),
      amenities: JSON.stringify([]),
      nearby: "{}",
      history: JSON.stringify([
        { date: new Date().toISOString().slice(0, 10), event: "Submitted by owner", price: input.expectedPrice },
      ]),
      agentId: null,
      featured: false,
      approved: false,
      views: 0,
    },
  })

  await createLeadWithNotifications({
    name: input.ownerName,
    email: input.email,
    phone: input.phone,
    intent: "selling",
    source: "listing",
    notes: `Submitted property ${slug} — ${input.address}. Timeline: ${input.timeline}.`,
    userEmailSubject: "We received your listing",
    userEmailBody: `Hi ${input.ownerName}, we received your submission for ${input.address}. An agent will call within one business day to verify details and finalize your listing. Reference ${slug}.`,
    adminEmailSubject: `New listing submission: ${input.address}`,
    adminEmailBody: `${input.ownerName} submitted ${input.address} (${input.type}, ${input.bedrooms}bd). Pending approval at /admin/properties.`,
    refType: "property",
    refId: property.id,
  })

  return { slug }
}

/**
 * Lightweight lead capture — newsletter, contact, market note.
 * The lightest rung on the conversion ladder.
 */
export async function captureLead(input: LeadInput) {
  const lead = await db.lead.create({
    data: {
      name: input.name ?? "Newsletter subscriber",
      email: input.email,
      phone: input.phone ?? null,
      intent: input.intent ?? "newsletter",
      source: input.source,
      stage: "new",
      city: input.city ?? null,
      budget: input.budget ?? null,
      notes: input.message ?? null,
    },
  })

  const isNewsletter = input.source === "insights"
  await db.notification.create({
    data: {
      type: "email",
      recipient: input.email,
      subject: isNewsletter
        ? "You're on the list — Sunday market notes start this week"
        : "Thanks for reaching out",
      body: isNewsletter
        ? "You'll get one short market note every Sunday. No spam, ever. Reply anytime to unsubscribe."
        : "Thanks for getting in touch. A Z0roCode agent will respond within one business day.",
      refType: "lead",
      refId: lead.id,
    },
  })

  return { id: lead.id }
}
