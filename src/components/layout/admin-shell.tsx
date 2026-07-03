"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

/** Shared shell for all admin pages. */
export function AdminShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false)
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar />
      {mobileNav && (
        <div className="fixed inset-0 z-50 bg-foreground/50 lg:hidden" onClick={() => setMobileNav(false)}>
          <div className="absolute left-0 top-0 h-full" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col min-w-0">
        {/* mobile top bar */}
        <div className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <button onClick={() => setMobileNav(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold">Z0roCode Admin</span>
          <span className="w-9" />
        </div>
        <div className="border-b border-border bg-card px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-6 scroll-elegant">{children}</div>
      </div>
    </div>
  )
}
