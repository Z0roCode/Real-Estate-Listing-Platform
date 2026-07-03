import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sell your home with confidence",
  description: "See what your home is worth, learn how we'd sell it, and get a clear plan. No pressure, no obligation. Pro photography, expert pricing, skilled negotiation.",
  alternates: { canonical: "/sell" },
  openGraph: {
    title: "Sell with confidence, not guesswork · Z0roCode Estates",
    description: "Get a free valuation and a clear selling plan. No pressure, no obligation.",
  },
}

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children
}
