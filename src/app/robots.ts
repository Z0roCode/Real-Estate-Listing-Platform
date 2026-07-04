import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/agent-dashboard", "/api", "/dashboard", "/auth"],
      },
    ],
    sitemap: "https://real-estate-listing-platform-tau.vercel.app/sitemap.xml",
  }
}
