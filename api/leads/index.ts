/**
 * /api/leads
 *
 *   POST — public lead capture. Mirrors the MarketingLeadCreate contract.
 *   GET  — admin-gated list of the most recent 500 leads. Requires
 *           `Authorization: Bearer <ADMIN_TOKEN>`.
 *
 * Behaviour intentionally matches the legacy Express route so existing form
 * clients keep working unchanged after the serverless cut-over.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { marketingLeadCreateSchema } from "../_lib/schema.js";
import { applySecurityHeaders, getClientIp, rateLimited, readJson } from "../_lib/http.js";
import {
  createLead,
  findRecentByEmail,
  getAllLeads,
  isPersistenceConfigured,
} from "../_lib/storage.js";

const DEDUPE_WINDOW_HOURS = 24;

async function handlePost(req: VercelRequest, res: VercelResponse) {
  const ip = getClientIp(req);
  if (rateLimited("lead-create", ip, 12, 10 * 60 * 1000)) {
    return res.status(429).json({
      ok: false,
      id: null,
      duplicate: false,
      message:
        "Too many requests from this connection. Please wait a few minutes or call 941-210-1663.",
    });
  }

  try {
    const raw = await readJson(req);
    const parsed = marketingLeadCreateSchema.parse(raw);

    // Honeypot: bots fill the invisible `website` field. Silently succeed so
    // they never learn the trap exists, and never write the row.
    if (parsed.website && parsed.website.trim().length > 0) {
      return res.status(201).json({
        ok: true,
        id: null,
        duplicate: false,
        message: "Thanks — we'll be in touch shortly.",
      });
    }

    // Fail closed: logs are not durable lead storage, and must not contain PII.
    if (!isPersistenceConfigured()) {
      res.setHeader("Retry-After", "300");
      return res.status(503).json({
        ok: false,
        id: null,
        duplicate: false,
        message: "Your request was not saved. Please call 941-210-1663 or try again later.",
      });
    }

    const sinceIso = new Date(
      Date.now() - DEDUPE_WINDOW_HOURS * 60 * 60 * 1000
    ).toISOString();
    const existing = await findRecentByEmail(parsed.email, sinceIso);
    if (existing) {
      return res.status(201).json({
        ok: true,
        id: existing.id,
        duplicate: true,
        message:
          "We already have your request on file from the last 24 hours — our team will be in touch shortly.",
      });
    }

    const { website: _honeypot, ...insertData } = parsed;
    const lead = await createLead(insertData);
    return res.status(201).json({
      ok: true,
      id: lead.id,
      duplicate: false,
      message: "Thanks — we'll be in touch shortly.",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        id: null,
        duplicate: false,
        message: "Please check the highlighted fields and try again.",
        errors: err.flatten().fieldErrors,
      });
    }
    if (err instanceof SyntaxError) {
      return res.status(400).json({ ok: false, id: null, message: "Invalid JSON." });
    }
    console.error("lead_create_failed");
    return res.status(500).json({
      ok: false,
      id: null,
      duplicate: false,
      message: "Something went wrong. Please try again in a moment.",
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const auth = (req.headers.authorization || "").toString();
  const [scheme, token] = auth.split(" ");
  const expected = process.env.ADMIN_TOKEN || "";
  if (scheme !== "Bearer" || !token || !expected || token !== expected) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  if (!isPersistenceConfigured()) {
    return res.status(503).json({
      ok: false,
      message: "Lead storage is not configured.",
    });
  }
  try {
    const leads = await getAllLeads();
    return res.status(200).json({ ok: true, leads });
  } catch (err) {
    console.error("lead_list_failed");
    return res.status(500).json({ ok: false, message: "Internal error" });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);
  if (req.method === "POST") return handlePost(req, res);
  if (req.method === "GET") return handleGet(req, res);
  return res.status(405).json({ ok: false, message: "Method Not Allowed" });
}
