import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ModalHost } from "@/components/modals/modal-host"
import { MobileBar } from "@/components/layout/mobile-bar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://z0rocode.com"),
  title: {
    default: "Z0roCode Estates — Find a place you'll love to call home",
    template: "%s · Z0roCode Estates",
  },
  description:
    "Handpicked homes, honest pricing, and a team that actually picks up the phone. Buying or selling, we make the move feel simple.",
  keywords: [
    "real estate",
    "homes for sale",
    "property listings",
    "buy a house",
    "sell a house",
    "mortgage calculator",
    "home valuation",
  ],
  authors: [{ name: "Z0roCode" }],
  openGraph: {
    title: "Z0roCode Estates",
    description: "Find a place you'll love to call home.",
    siteName: "Z0roCode Estates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z0roCode Estates",
    description: "Find a place you'll love to call home.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground">
          Skip to content
        </a>
        {children}
        <ModalHost />
        <MobileBar />
      </body>
    </html>
  )
}
