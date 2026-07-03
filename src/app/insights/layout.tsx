import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Market insights, plain English",
  description: "Short, useful reads on buying, selling, and the market. No jargon, no fluff. Get the weekly market note every Sunday.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Market insights, plain English · Z0roCode Estates",
    description: "Short, useful reads on buying, selling, and the market.",
  },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return children
}
