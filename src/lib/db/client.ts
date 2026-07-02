import { PrismaClient } from "@prisma/client"

/**
 * Prisma client singleton.
 *
 * Logging is environment-aware:
 *  - Development: query + error + warn logs (useful while building)
 *  - Production:  error + warn only (query logs flood Vercel, leak schema,
 *                 and add overhead — never log queries in prod)
 *
 * The global cache prevents connection exhaustion on serverless hot-reloads
 * in dev. In production (Vercel), each function invocation may create a new
 * client, but Prisma + the Supabase/Neon pooler handles connection reuse.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const isDev = process.env.NODE_ENV !== "production"

function createPrismaClient() {
  return new PrismaClient({
    log: isDev
      ? ["query", "error", "warn"]
      : ["error", "warn"],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (isDev) globalForPrisma.prisma = db
