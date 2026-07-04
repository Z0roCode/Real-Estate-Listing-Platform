/**
 * Injects JSON-LD structured data into the page head for SEO.
 * Renders a <script type="application/ld+json"> tag.
 */
import { config } from "@/lib/config"

export function StructuredData({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  const json = JSON.stringify(Array.isArray(data) ? data : [data])
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

/** Schema for the real estate agency (used on homepage + about). */
export function agencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Z0roCode Estates",
    description: "A modern real estate marketplace for buyers and sellers who value transparency and great photography.",
    url: config.siteUrl,
    telephone: "(512) 555-0100",
    email: "hello@z0rocode.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2200 Congress Ave",
      addressLocality: "Austin",
      addressRegion: "TX",
      postalCode: "78701",
      addressCountry: "US",
    },
    areaServed: ["Austin", "Denver", "Seattle", "Miami", "Nashville", "San Francisco", "Chicago", "New York", "Phoenix", "Portland"],
    priceRange: "$$$",
  }
}

/** Schema for a single property listing. */
export function propertySchema(p: {
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  zip: string
  bedrooms: number
  bathrooms: number
  sqft: number
  images: string[]
  slug: string
  agentName?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: p.title,
    description: p.description,
    url: `${config.siteUrl}/buy/${p.slug}`,
    image: p.images,
    numberOfRooms: p.bedrooms + p.bathrooms,
    numberOfBedrooms: p.bedrooms,
    numberOfBathroomsTotal: p.bathrooms,
    floorSize: { "@type": "QuantitativeValue", value: p.sqft, unitText: "sqft" },
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address,
      addressLocality: p.city,
      addressRegion: p.state,
      postalCode: p.zip,
      addressCountry: "US",
    },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    ...(p.agentName ? { agent: { "@type": "RealEstateAgent", name: p.agentName } } : {}),
  }
}

/** Breadcrumb list schema. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** FAQ schema for the sell page. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

/** Article schema for insights. */
export function articleSchema(a: { title: string; description: string; date: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Organization", name: "Z0roCode Estates" },
    publisher: {
      "@type": "Organization",
      name: "Z0roCode Estates",
    },
    mainEntityOfPage: `${config.siteUrl}/insights/${a.slug}`,
  }
}
