/**
 * Image helper.
 *
 * Security note: this demo caches real, publicly-hosted property photos in the
 * database at seed time (see prisma/seed.ts). We do NOT call any external image
 * API from the browser. The image-search tool is only used offline during
 * seeding, and the resulting stable OSS URLs are stored against each property
 * so the site never refetches or leaks any third-party API key at runtime.
 *
 * If you want to swap in the Unsplash API for your own deployment, set
 * UNSPLASH_ACCESS_KEY in your environment and implement `fetchFromUnsplash`
 * below — it is intentionally left as a no-op so no key is ever required for
 * the demo to run.
 */

export interface ImageResult {
  url: string
  alt: string
}

/**
 * Reserved for production use. The demo ships with a pre-seeded image set, so
 * this function is never called at runtime and no API key is needed.
 */
export async function fetchFromUnsplash(
  _query: string,
  _count = 8,
): Promise<ImageResult[]> {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return []
  }
  // Example of a safe server-side implementation (NOT used by the demo):
  //
  //   const res = await fetch(
  //     `https://api.unsplash.com/search/photos?query=${encodeURIComponent(_query)}&per_page=${_count}`,
  //     { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } },
  //   )
  //   const data = await res.json()
  //   return data.results.map((r: any) => ({ url: r.urls.regular, alt: r.alt_description ?? _query }))
  return []
}
