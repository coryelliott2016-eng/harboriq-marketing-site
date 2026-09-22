/**
 * Small helpers shared across every serverless function so the handlers stay
 * focused on business logic instead of transport plumbing.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Extract the request's originating IP for rate-limiting keys. */
export function getClientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : (fwd || "").toString().split(",")[0];
  return (first || req.socket?.remoteAddress || "unknown").trim();
}

/** Node runtime doesn't populate req.body for POSTs unless we tell Vercel to parse it. */
export async function readJson<T = unknown>(req: VercelRequest): Promise<T> {
  if (req.body && typeof req.body === "object") return req.body as T;
  if (typeof req.body === "string" && req.body.length > 0) {
    return JSON.parse(req.body) as T;
  }
  return {} as T;
}

/**
 * Basic in-memory fixed-window rate limiter keyed by IP + bucket name.
 *
 * Serverless invocations do share warm instances, so this catches the common
 * abusive-bot case without adding a Redis dependency. It intentionally does
 * NOT try to be a security control — that lives in Vercel's edge WAF and in
 * the honeypot on the create-lead endpoint.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(
  bucket: string,
  ip: string,
  max: number,
  windowMs: number
): boolean {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      buckets.forEach((v, k) => {
        if (v.resetAt <= now) buckets.delete(k);
      });
    }
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

/** Common security response headers applied to every JSON reply. */
export function applySecurityHeaders(res: VercelResponse): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cache-Control", "no-store");
}
