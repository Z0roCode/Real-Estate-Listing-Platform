"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Building2,
  ChevronDown,
  Heart,
  Menu,
  X,
  Calendar,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

const BUY_LINKS = [
  { label: "Browse all homes", href: "/buy" },
  { label: "Featured homes", href: "/buy?featured=1" },
  { label: "Luxury ($1.5M+)", href: "/buy?minPrice=1500000" },
  { label: "New listings", href: "/buy?sort=newest" },
]
const SELL_LINKS = [
  { label: "Get a valuation", href: "/sell/valuation" },
  { label: "List your property", href: "/sell", action: "list" as const },
  { label: "How we sell", href: "/sell" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { openBooking, openListProperty, savedIds } = useModal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // transparent over hero on homepage only, at top
  const transparent = pathname === "/" && !scrolled

  // Close any open menus (called from nav link clicks).
  const closeMenus = () => { setMobileOpen(false); setOpenMenu(null) }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        transparent
          ? "bg-transparent"
          : "border-b border-border/70 bg-background/85 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={`text-[15px] font-bold tracking-tight ${
                transparent ? "text-background" : "text-foreground"
              }`}
            >
              Z0roCode <span className="text-primary">Estates</span>
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-[0.18em] ${
                transparent ? "text-background/70" : "text-muted-foreground"
              }`}
            >
              Real Estate, Done Right
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavDropdown
            label="Buy"
            links={BUY_LINKS}
            open={openMenu === "buy"}
            onOpenChange={(o) => setOpenMenu(o ? "buy" : null)}
            transparent={transparent}
          />
          <NavDropdown
            label="Sell"
            links={SELL_LINKS}
            open={openMenu === "sell"}
            onOpenChange={(o) => setOpenMenu(o ? "sell" : null)}
            transparent={transparent}
            onAction={(href) => href === "/sell" && openListProperty()}
          />
          <NavLink href="/agents" transparent={transparent}>
            Agents
          </NavLink>
          <NavLink href="/insights" transparent={transparent}>
            Insights
          </NavLink>
          <NavLink href="/about" transparent={transparent}>
            About
          </NavLink>
        </nav>

        {/* Right utility */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/dashboard"
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              transparent
                ? "text-background/90 hover:bg-background/15"
                : "text-foreground hover:bg-muted"
            }`}
            aria-label="Saved homes"
          >
            <Heart className="h-[18px] w-[18px]" />
            {savedIds.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {savedIds.length}
              </span>
            )}
          </Link>
          <Link href="/auth/sign-in">
            <Button variant="ghost" size="sm" className={transparent ? "text-background hover:bg-background/15" : ""}>
              Sign in
            </Button>
          </Link>
          <Button size="sm" onClick={() => openBooking()} className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Book a consultation
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden ${
            transparent ? "text-background" : "text-foreground"
          }`}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            <MobileSection title="Buy">
              {BUY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-md px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted">
                  {l.label}
                </Link>
              ))}
            </MobileSection>
            <MobileSection title="Sell">
              <Link href="/sell/valuation" className="rounded-md px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted">
                Get a valuation
              </Link>
              <button onClick={() => { setMobileOpen(false); openListProperty() }} className="rounded-md px-3 py-2.5 text-left text-sm text-foreground/80 hover:bg-muted">
                List your property
              </button>
              <Link href="/sell" className="rounded-md px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted">
                How we sell
              </Link>
            </MobileSection>
            <Link href="/agents" className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Agents</Link>
            <Link href="/insights" className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Insights</Link>
            <Link href="/about" className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">About</Link>
            <Link href="/dashboard" className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Saved homes ({savedIds.length})</Link>
            <div className="mt-2 flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild><Link href="/auth/sign-in">Sign in</Link></Button>
              <Button size="sm" onClick={() => { setMobileOpen(false); openBooking() }} className="gap-1.5">
                <Calendar className="h-4 w-4" /> Book a consultation
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setMobileOpen(false); openListProperty() }} className="gap-1.5">
                <Plus className="h-4 w-4" /> List a property
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  transparent,
  children,
}: {
  href: string
  transparent: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        transparent
          ? "text-background/90 hover:bg-background/15"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  )
}

function NavDropdown({
  label,
  links,
  open,
  onOpenChange,
  transparent,
  onAction,
}: {
  label: string
  links: { label: string; href: string; action?: "list" }[]
  open: boolean
  onOpenChange: (o: boolean) => void
  transparent: boolean
  onAction?: (href: string) => void
}) {
  return (
    <div className="relative" onMouseEnter={() => onOpenChange(true)} onMouseLeave={() => onOpenChange(false)}>
      <button
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          transparent ? "text-background/90 hover:bg-background/15" : "text-foreground/80 hover:bg-muted"
        }`}
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2">
          <div className="w-56 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-modal">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => {
                  onOpenChange(false)
                  if (l.action === "list" && onAction) onAction(l.href)
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {l.action === "list" ? (
                  <Link href="/sell">{l.label}</Link>
                ) : (
                  <Link href={l.href}>{l.label}</Link>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/60 pb-2">
      <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}
