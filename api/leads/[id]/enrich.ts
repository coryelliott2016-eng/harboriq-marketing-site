/**
 * POST /api/leads/:id/enrich — attach optional Step-2 discovery answers to a
 * lead created by the previous /api/leads submission.
 *
 * Uses the same dynamic path routing convention Vercel expects for file-based
 * serverless functions ("[id]" becomes `req.query.id`).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { marketingLeadEnrichSchema } from "../../_lib/schema.js";
import { applySecurityHeaders, getClientIp, rateLimited, readJson } from "../../_lib/http.js";
import { enrichLead, isPersistenceConfigured } from "../../_lib/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, id: null, message: "Method Not Allowed" });
  }

  const ip = getClientIp(req);
  if (rateLimited("lead-enrich", ip, 12, 10 * 60 * 1000)) {
    return res.status(429).json({
      ok: false,
      id: null,
      message:
        "Too many requests from this connection. Email Cory@HarborIQ.com and we'll pick it up there.",
    });
  }

  const rawId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const id = Number(rawId);
  if (!/^[1-9]\d*$/.test(String(rawId)) || !Number.isSafeInteger(id)) {
    return res.status(400).json({ ok: false, id: null, message: "Invalid lead id." });
  }

  try {
    const raw = await readJson(req);
    const patch = marketingLeadEnrichSchema.parse(raw ?? {});
    if (!isPersistenceConfigured()) {
      return res.status(503).json({ ok: false, id: null, message: "Lead storage is temporarily unavailable." });
    }
    // Sequential lead IDs are not authorization. Until per-submission access
    // tokens are implemented, only the authenticated administrator may enrich.
    if (!process.env.ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return res.status(401).json({ ok: false, id: null, message: "Unauthorized" });
    }
    const updated = await enrichLead(id, patch);
    if (!updated) {
      return res.status(404).json({ ok: false, id: null, message: "Lead not found." });
    }
    return res.status(200).json({
      ok: true,
      id: updated.id,
      message: "Thanks — that helps us tailor your demo.",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        id: null,
        message: "Please check the highlighted fields and try again.",
        errors: err.flatten().fieldErrors,
      });
    }
    if (err instanceof SyntaxError) {
      return res.status(400).json({ ok: false, id: null, message: "Invalid JSON." });
    }
    console.error("lead_enrich_failed");
    return res.status(500).json({
      ok: false,
      id: null,
      message: "Something went wrong. Please try again in a moment.",
    });
  }
}
