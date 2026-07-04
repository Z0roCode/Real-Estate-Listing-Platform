import { createHmac, timingSafeEqual } from "crypto"

/**
 * Signed session tokens.
 *
 * The session cookie stores `userId.signature` where the signature is an
 * HMAC-SHA256 of the userId using SESSION_SECRET. This means the cookie
 * can't be tampered with — if someone changes the userId, the signature
 * no longer matches and verification fails.
 *
 * Why not just store the raw userId? Because user IDs are often guessable
 * (cuid has some structure, sequential IDs are trivially enumerable). An
 * unsigned cookie lets anyone impersonate anyone by guessing or leaking an
 * ID. A signed cookie proves the server issued it.
 *
 * For the demo, SESSION_SECRET falls back to a dev-only value so local
 * development works without env vars. In production, set SESSION_SECRET to
 * a long random string — the app warns at startup if it's missing.
 */

const DEV_FALLBACK_SECRET = "dev-only-secret-do-not-use-in-production-z0rocode-estates"

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[auth] SESSION_SECRET is not set. Using an insecure fallback. " +
          "Set SESSION_SECRET in your production environment to a long random string.",
      )
    }
    return DEV_FALLBACK_SECRET
  }
  return secret
}

/** Create a signed session token for a user ID. */
export function signSession(userId: string): string {
  const sig = createHmac("sha256", getSecret()).update(userId).digest("hex")
  return `${userId}.${sig}`
}

/**
 * Verify a session token and return the user ID, or null if invalid/tampered.
 * Uses timingSafeEqual to prevent timing attacks on the signature comparison.
 */
export function verifySession(token: string | undefined | null): string | null {
  if (!token) return null
  const [userId, sig] = token.split(".")
  if (!userId || !sig) return null

  const expected = createHmac("sha256", getSecret()).update(userId).digest("hex")

  // timingSafeEqual requires equal-length buffers; the hex digests are always
  // 64 chars, so a length mismatch means the signature is definitely wrong.
  if (sig.length !== expected.length) return null

  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? userId : null
  } catch {
    return null
  }
}

/** Extract + verify the user ID from a request's session cookie. */
export function getUserIdFromRequest(request: Request): string | null {
  const cookie = request.headers.get("cookie") || ""
  const match = cookie.match(/zc_session=([^;]+)/)
  return match ? verifySession(match[1]) : null
}
