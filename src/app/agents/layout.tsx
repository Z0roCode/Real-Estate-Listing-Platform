import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meet our agents",
  description: "Real people with real specialties. Pick the agent who fits your move, or let us match you. Every agent meets the same bar for responsiveness and results.",
  alternates: { canonical: "/agents" },
  openGraph: {
    title: "Meet the people who'll get you home · Z0roCode Estates",
    description: "Real people with real specialties. Pick the agent who fits your move.",
  },
}

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
