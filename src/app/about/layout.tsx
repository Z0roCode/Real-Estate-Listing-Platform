import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Z0roCode Estates",
  description: "We're Z0roCode. We help people move well. A modern real estate agency built on transparency, great photography, and a frictionless search.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Z0roCode Estates",
    description: "We help people move well. A modern agency built on transparency and trust.",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
