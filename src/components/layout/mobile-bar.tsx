"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Heart, Calendar } from "lucide-react"
import { useModal } from "@/lib/modal-store"

/** Sticky mobile bottom bar: Search · Saved · Book a call. Hidden on property detail. */
export function MobileBar() {
  const pathname = usePathname()
  const { openBooking, savedIds } = useModal()

  // hide on property detail (it has its own sticky bar) and in app dashboards
  if (pathname.startsWith("/buy/") || pathname.startsWith("/admin") || pathname.startsWith("/agent-dashboard") || pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3">
        <Link
          href="/buy"
          className="flex flex-col items-center gap-0.5 py-2.5 text-muted-foreground"
        >
          <Search className="h-5 w-5" />
          <span className="text-[11px] font-medium">Search</span>
        </Link>
        <Link
          href="/dashboard"
          className="relative flex flex-col items-center gap-0.5 py-2.5 text-muted-foreground"
        >
          <Heart className="h-5 w-5" />
          <span className="text-[11px] font-medium">Saved</span>
          {savedIds.length > 0 && (
            <span className="absolute right-[28%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {savedIds.length}
            </span>
          )}
        </Link>
        <button
          onClick={() => openBooking()}
          className="flex flex-col items-center gap-0.5 py-2.5 text-primary"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[11px] font-medium">Book a call</span>
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  )
}
