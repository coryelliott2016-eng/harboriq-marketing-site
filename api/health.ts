/**
 * GET /api/health — public liveness probe.
 *
 * Returns a small JSON payload and the deployed commit so ops can confirm a
 * deployment is actually receiving traffic. No secrets, no DB access.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { applySecurityHeaders } from "./_lib/http.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }
  return res.status(200).json({
    ok: true,
    service: "harboriq-marketing",
    version: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    region: process.env.VERCEL_REGION || "unknown",
    timestamp: new Date().toISOString(),
  });
}
