"use client"

import { MapPin } from "lucide-react"

interface StaticMapProps {
  latitude: number
  longitude: number
  label?: string
}

/**
 * Lightweight embedded map using OpenStreetMap's free embed endpoint.
 * No API key required (unlike Google Maps), and it loads entirely in the
 * browser — no server-side proxy needed. The bbox is a small window around
 * the property's coordinates so the marker stays centered.
 */
export function StaticMap({ latitude, longitude, label }: StaticMapProps) {
  // ~0.01 degree padding ≈ ~1.1km — gives a tight, readable map window
  const pad = 0.01
  const bbox = `${longitude - pad},${latitude - pad},${longitude + pad},${latitude + pad}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative aspect-[16/10] w-full bg-muted">
        <iframe
          title={`Map of ${label ?? "property"}`}
          src={src}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-4 py-2.5 text-sm">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">{label}</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs font-medium text-primary hover:underline"
        >
          Open in maps →
        </a>
      </div>
    </div>
  )
}
