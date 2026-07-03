import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Talk to a real person. No call centers, no bots. Send a message and an agent responds within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Talk to a real person · Z0roCode Estates",
    description: "Send a message and an agent responds within one business day.",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
