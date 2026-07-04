"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bed, Bath, Maximize, MapPin, Calendar, Home as HomeIcon, Ruler, Check, Phone, Mail, ShieldCheck, Heart, Share2, Download, ChevronLeft, Eye, Clock, Zap, ArrowRight, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { PropertyGallery } from "@/components/property/gallery"
import { MortgageCalculator } from "@/components/property/mortgage-calculator"
import { StaticMap } from "@/components/property/map"
import { ContactForm } from "@/components/forms/contact-form"
import { PropertyCard } from "@/components/property/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useModal } from "@/lib/modal-store"
import { StructuredData, propertySchema, breadcrumbSchema } from "@/lib/schema"
import type { Property } from "@/lib/types"
import { formatCurrency, formatSqft, formatBathrooms, formatFullAddress, formatNumber, timeAgo } from "@/lib/helpers"

const STATUS_STYLES: Record<string, string> = {
  "For Sale": "bg-primary text-primary-foreground",
  Pending: "bg-amber-500 text-white",
  Sold: "bg-zinc-700 text-white",
}

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("")
  useEffect(() => { params.then((p) => setSlug(p.slug)) }, [params])
  if (!slug) return null
  return <Detail slug={slug} />
}

function Detail({ slug }: { slug: string }) {
  const router = useRouter()
  const { openBooking, toggleSave, isSaved, showToast } = useModal()
  const [property, setProperty] = useState<Property | null>(null)
  const [similar, setSimilar] = useState<Property[]>([])
  const [recent, setRecent] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/properties/${slug}`)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json() })
      .then((d) => {
        if (cancelled) return
        setProperty(d.property)
        const key = "zc_recent"
        const list: string[] = JSON.parse(localStorage.getItem(key) || "[]")
        const next = [d.property.id, ...list.filter((x) => x !== d.property.id)].slice(0, 6)
        localStorage.setItem(key, JSON.stringify(next))
        setLoading(false)
      })
      .catch(() => { if (!cancelled) { setNotFound(true); setLoading(false) } })
    return () => { cancelled = true }
  }, [slug])

  // fetch similar + recently viewed
  useEffect(() => {
    if (!property) return
    fetch("/api/properties")
      .then((r) => r.json())
      .then((d) => {
        const all: Property[] = d.properties ?? []
        setSimilar(
          all
            .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
            .slice(0, 3),
        )
        const recentIds: string[] = JSON.parse(localStorage.getItem("zc_recent") || "[]")
        setRecent(all.filter((p) => recentIds.includes(p.id) && p.id !== property.id).slice(0, 3))
      })
  }, [property])

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: property?.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShareCopied(true)
        showToast("Link copied", "Share this home with anyone.")
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {}
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">We couldn&apos;t find that home.</h1>
          <p className="mt-2 text-muted-foreground">It may have sold or the link may be broken.</p>
          <Button asChild className="mt-6"><Link href="/buy">Browse all homes</Link></Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (loading || !property) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-32 w-full" /><Skeleton className="h-48 w-full" /></div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const saved = isSaved(property.id)
  const fullAddress = formatFullAddress(property)

  const specs = [
    { icon: Bed, label: "Bedrooms", value: String(property.bedrooms) },
    { icon: Bath, label: "Bathrooms", value: formatBathrooms(property.bathrooms) },
    { icon: Maximize, label: "Square feet", value: formatNumber(property.sqft) },
    { icon: HomeIcon, label: "Type", value: property.type },
    { icon: Calendar, label: "Year built", value: property.yearBuilt ? String(property.yearBuilt) : "—" },
    { icon: Ruler, label: "Lot size", value: property.lotSize ? `${property.lotSize} acres` : "—" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StructuredData data={[
        propertySchema({
          title: property.title,
          description: property.description,
          price: property.price,
          address: property.address,
          city: property.city,
          state: property.state,
          zip: property.zip,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.sqft,
          images: property.images,
          slug: property.slug,
          agentName: property.agent?.name,
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://real-estate-listing-platform-tau.vercel.app" },
          { name: "Buy", url: "https://real-estate-listing-platform-tau.vercel.app/buy" },
          { name: property.title, url: `https://real-estate-listing-platform-tau.vercel.app/buy/${property.slug}` },
        ]),
      ]} />
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-24 lg:pb-0">
        {/* breadcrumb */}
        <div className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/buy" className="hover:text-foreground">Buy</Link>
            <span>/</span>
            <span className="truncate text-foreground">{property.title}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to listings
          </button>

          <PropertyGallery images={property.images} alt={property.title} />

          {/* title + actions */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[property.status]}`}>{property.status}</span>
                <Badge variant="outline" className="font-medium text-muted-foreground">{property.type}</Badge>
                {property.energyRating && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"><Zap className="h-3 w-3" /> Energy {property.energyRating}</span>
                )}
              </div>
              <h1 className="text-h2 mt-2 text-foreground">{formatCurrency(property.price)}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{fullAddress}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{property.views} views</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Listed {property.daysListed} days ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toggleSave(property.id)}>
                <Heart className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} /> {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={share}>
                <Share2 className="h-4 w-4" /> {shareCopied ? "Copied" : "Share"}
              </Button>
            </div>
          </div>

          {/* specs */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
            {specs.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"><s.icon className="h-3.5 w-3.5 text-primary" />{s.label}</span>
                <span className="text-sm font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>

          {/* two column body */}
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              {/* about */}
              <section>
                <h2 className="text-xl font-bold text-foreground">About this home</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-foreground/80">{property.description}</p>
              </section>

              {/* features + amenities */}
              <section>
                <h2 className="text-xl font-bold text-foreground">Features &amp; amenities</h2>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {property.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-foreground/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</div>
                  ))}
                </div>
                {property.amenities.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Building amenities</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {property.amenities.map((a) => <Badge key={a} variant="secondary" className="font-medium">{a}</Badge>)}
                    </div>
                  </div>
                )}
              </section>

              {/* nearby */}
              <section>
                <h2 className="text-xl font-bold text-foreground">Location &amp; nearby</h2>
                <p className="mt-1 text-sm text-muted-foreground">{fullAddress}</p>
                <div className="mt-4"><StaticMap latitude={property.latitude} longitude={property.longitude} label={fullAddress} /></div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <NearbyList title="Schools" items={property.nearby.schools} />
                  <NearbyList title="Hospitals" items={property.nearby.hospitals} />
                  <NearbyList title="Shopping" items={property.nearby.shopping} />
                  <NearbyList title="Transit" items={property.nearby.transit} />
                </div>
              </section>

              {/* history */}
              {property.history.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-foreground">Property history</h2>
                  <div className="mt-4 space-y-3">
                    {property.history.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 border-l-2 border-primary/30 py-1 pl-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{h.event}</p>
                          <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                        {h.price && <span className="ml-auto text-sm font-semibold text-foreground">{formatCurrency(h.price)}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-5 lg:sticky lg:top-24">
                {/* agent card */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Listing agent</p>
                  {property.agent ? (
                    <Link href={`/agents/${property.agent.slug}`} className="mt-3 flex items-center gap-3 group">
                      <Image src={property.agent.photo} alt={property.agent.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" unoptimized />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary">{property.agent.name}</p>
                        <p className="text-xs text-muted-foreground">{property.agent.title}</p>
                      </div>
                    </Link>
                  ) : (
                    <p className="mt-3 text-sm text-foreground">Z0roCode Estates</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-primary" />Verified · responds within 1 business day</div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {property.agent && <a href={`tel:${property.agent.phone}`}><Button variant="outline" size="sm" className="w-full gap-1.5"><Phone className="h-3.5 w-3.5" />Call</Button></a>}
                    {property.agent && <a href={`mailto:${property.agent.email}`}><Button variant="outline" size="sm" className="w-full gap-1.5"><Mail className="h-3.5 w-3.5" />Email</Button></a>}
                  </div>
                  <Button className="mt-3 w-full gap-1.5" onClick={() => openBooking({ propertyId: property.id, propertyTitle: property.title })}>
                    <Calendar className="h-4 w-4" /> Schedule a viewing
                  </Button>
                </div>

                {/* mortgage */}
                <MortgageCalculator homePrice={property.price} />

                {/* actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={share}><Share2 className="h-3.5 w-3.5" /> Share</Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => showToast("Brochure ready", "A one-page PDF spec sheet would download here.")}><Download className="h-3.5 w-3.5" /> Brochure</Button>
                </div>

                {/* contact form */}
                <ContactForm propertyId={property.id} propertyAddress={fullAddress} />
              </div>
            </div>
          </div>

          {/* similar */}
          {similar.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-foreground">Similar homes you may like</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              </div>
            </section>
          )}

          {/* recently viewed */}
          {recent.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-foreground">Recently viewed</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* sticky mobile action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2 p-3">
          <Button variant="outline" className="flex-1 gap-1.5" onClick={() => toggleSave(property.id)}>
            <Heart className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} /> Save
          </Button>
          <Button className="flex-[2] gap-1.5" onClick={() => openBooking({ propertyId: property.id, propertyTitle: property.title })}>
            <Calendar className="h-4 w-4" /> Schedule viewing
          </Button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      <SiteFooter />
    </div>
  )
}

function NearbyList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((x) => <li key={x} className="text-sm text-foreground/80">{x}</li>)}
      </ul>
    </div>
  )
}
