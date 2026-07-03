import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse homes for sale",
  description: "Search every home we represent. Filter by price, beds, baths, type, and city. Real photos, honest pricing, instant results.",
  alternates: { canonical: "/buy" },
  openGraph: {
    title: "Browse homes for sale · Z0roCode Estates",
    description: "Search every home we represent. Real photos, honest pricing, instant results.",
  },
}

export default function BuyLayout({ children }: { children: React.ReactNode }) {
  return children
}
