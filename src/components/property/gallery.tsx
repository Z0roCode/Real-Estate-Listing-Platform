"use client"

import Image from "next/image"
import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Expand, X, Image as ImageIcon, Video, Layout } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface GalleryProps {
  images: string[]
  alt: string
}

type Tab = "photos" | "video" | "floorplan"

export function PropertyGallery({ images, alt }: GalleryProps) {
  const [tab, setTab] = useState<Tab>("photos")
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  const goTo = useCallback((dir: 1 | -1) => setActive((i) => (i + dir + images.length) % images.length), [images.length])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowRight") goTo(1)
      if (e.key === "ArrowLeft") goTo(-1)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [lightbox, goTo])

  return (
    <div>
      {/* tabs */}
      <div className="mb-3 flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        <TabBtn active={tab === "photos"} onClick={() => setTab("photos")} icon={ImageIcon} label="Photos" />
        <TabBtn active={tab === "video"} onClick={() => setTab("video")} icon={Video} label="Video" />
        <TabBtn active={tab === "floorplan"} onClick={() => setTab("floorplan")} icon={Layout} label="Floor plan" />
      </div>

      <AnimatePresence mode="wait">
        {tab === "photos" && (
          <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* main image */}
            <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
              {!loaded[active] && <Skeleton className="absolute inset-0" />}
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="absolute inset-0">
                  <Image src={images[active]} alt={`${alt} — photo ${active + 1}`} fill priority={active === 0} sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover"
                    onLoad={() => setLoaded((p) => ({ ...p, [active]: true }))} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <span className="rounded-md bg-foreground/70 px-2.5 py-1 text-xs font-medium text-background backdrop-blur">{active + 1} / {images.length}</span>
                <button onClick={() => setLightbox(true)} className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground/70 text-background backdrop-blur hover:bg-foreground/90" aria-label="Open fullscreen"><Expand className="h-4 w-4" /></button>
              </div>
              {images.length > 1 && (
                <>
                  <button onClick={() => goTo(-1)} className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-background group-hover:opacity-100" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={() => goTo(1)} className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-background group-hover:opacity-100" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
                </>
              )}
            </div>
            {/* thumbnails */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${i === active ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-90"}`} aria-label={`Photo ${i + 1}`}>
                  <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "video" && (
          <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex aspect-[16/10] w-full flex-col items-center justify-center rounded-xl border border-border bg-foreground text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/15 text-background"><Video className="h-8 w-8" /></span>
            <p className="mt-4 text-lg font-semibold text-background">Video walkthrough</p>
            <p className="mt-1 max-w-sm text-sm text-background/60">A full guided video tour is available for this home. Request it and we&apos;ll send the link within the hour.</p>
          </motion.div>
        )}

        {tab === "floorplan" && (
          <motion.div key="floorplan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex aspect-[16/10] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"><Layout className="h-8 w-8" /></span>
            <p className="mt-4 text-lg font-semibold text-foreground">Interactive floor plan</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">A detailed floor plan is available on request. Download the brochure for the full spec sheet.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 p-4 backdrop-blur" onClick={() => setLightbox(false)}>
          <button className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/15 text-background hover:bg-background/30" onClick={() => setLightbox(false)} aria-label="Close"><X className="h-5 w-5" /></button>
          <button className="absolute left-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background/15 text-background hover:bg-background/30" onClick={(e) => { e.stopPropagation(); goTo(-1) }} aria-label="Previous"><ChevronLeft className="h-6 w-6" /></button>
          <motion.div key={active} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="relative h-[82vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[active]} alt={`${alt} — photo ${active + 1}`} fill sizes="100vw" className="object-contain" />
          </motion.div>
          <button className="absolute right-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background/15 text-background hover:bg-background/30" onClick={(e) => { e.stopPropagation(); goTo(1) }} aria-label="Next"><ChevronRight className="h-6 w-6" /></button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-background/15 px-3 py-1.5 text-sm font-medium text-background">{active + 1} / {images.length}</span>
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  )
}
