/** Formatting helpers used across the UI. */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPriceCompact(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`
  }
  return formatCurrency(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatSqft(value: number): string {
  return `${formatNumber(value)} sqft`
}

export function formatBathrooms(value: number): string {
  return Number.isInteger(value) ? `${value}` : `${value}`
}

export function formatFullAddress(p: {
  address: string
  city: string
  state: string
  zip: string
}): string {
  return `${p.address}, ${p.city}, ${p.state} ${p.zip}`
}

/** "3 days ago", "2 weeks ago" etc. */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return "today"
  if (days === 1) return "1 day ago"
  if (days < 7) return `${days} days ago`
  if (days < 14) return "1 week ago"
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 60) return "1 month ago"
  return `${Math.floor(days / 30)} months ago`
}

/** Pretty date for appointment confirmations: "Mon, Jul 3" */
export function prettyDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function prettyTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
}
