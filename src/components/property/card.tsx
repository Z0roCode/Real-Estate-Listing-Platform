"use client"

import Image from "next/image"
import Link from "next/link"
import { Bed, Bath, Maximize, MapPin, Heart, Eye, Calendar, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"
import {
  formatPriceCompact,
  formatCurrency,
  formatSqft,
  formatBathrooms,
} from "@/lib/helpers"
import { useModal } from "@/lib/modal-store"

interface PropertyCardProps {
  property: Property
  /** First card spans 2 columns on desktop for visual rhythm. */
  featured?: boolean
  index?: number
}

const STATUS_STYLES: Record<string, string> = {
  "For Sale": "bg-primary text-primary-foreground",
  Pending: "bg-amber-500 text-white",
  Sold: "bg-zinc-700 text-white",
}

export function PropertyCard({ property, featured, index = 0 }: PropertyCardProps) {
  const { toggleSave, isSaved, openBooking, openSignup } = useModal()
  const saved = isSaved(property.id)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // anonymous → signup with pending save; signed in handled in store
    toggleSave(property.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="group relative"
    >
      <Link
        href={`/buy/${property.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
          {/* status + featured */}
          <div className="absolute left-3 top-3 flex gap-2">
            <span className={`rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm ${STATUS_STYLES[property.status] ?? "bg-zinc-800 text-white"}`}>
              {property.status}
            </span>
            {property.featured && (
              <span className="rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                Featured
              </span>
            )}
          </div>
          {/* save */}
          <button
            onClick={handleSave}
            className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${saved ? "bg-primary text-primary-foreground" : "bg-background/85 text-foreground/70 hover:bg-background"}`}
            aria-label={saved ? "Remove from saved" : "Save this home"}
            aria-pressed={saved}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
          {/* price */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-background/95 px-2.5 py-1 text-base font-bold text-foreground shadow-sm backdrop-blur">
            {formatPriceCompact(property.price)}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-foreground">{property.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{property.address}, {property.city}, {property.state}</span>
          </p>

          {/* specs */}
          <div className="mt-3 flex items-center gap-4 border-t border-border/60 pt-3 text-sm text-foreground/80">
            <span className="flex items-center gap-1.5"><Bed className="h-4 w-4 text-primary" /><span className="font-medium">{property.bedrooms}</span><span className="text-muted-foreground">bd</span></span>
            <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" /><span className="font-medium">{formatBathrooms(property.bathrooms)}</span><span className="text-muted-foreground">ba</span></span>
            <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-primary" /><span className="font-medium">{formatSqft(property.sqft)}</span></span>
          </div>

          {/* footer: agent + meta */}
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <div className="flex items-center gap-2 min-w-0">
              {property.agent && (
                <Image src={property.agent.photo} alt={property.agent.name} width={24} height={24} className="h-6 w-6 rounded-full object-cover" unoptimized />
              )}
              <span className="truncate text-xs text-muted-foreground">{property.agent?.name ?? "Z0roCode"}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{property.views}</span>
              <span>{property.daysListed}d</span>
            </div>
          </div>

          {/* hover actions */}
          <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); openBooking({ propertyId: property.id, propertyTitle: property.title, defaultType: "video" }) }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Calendar className="h-3.5 w-3.5" /> Quick tour
            </button>
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
              View <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
