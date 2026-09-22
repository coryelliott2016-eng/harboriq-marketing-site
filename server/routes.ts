import type { Express } from "express";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import {
  marketingLeadCreateSchema,
  marketingLeadEnrichSchema,
  chatRequestSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { ASSISTANT_SYSTEM_PROMPT } from "./assistant-prompt";
import { rateLimit } from "./security-headers";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "harboriq-admin-dev";
const DEDUPE_WINDOW_HOURS = 24;

// --- AI assistant config ---
const CHAT_MODEL = "claude_haiku_4_5";
const CHAT_MAX_TOKENS = 700;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

/** Tiny in-memory fixed-window rate limiter, keyed by client IP. */
const chatHits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = chatHits.get(ip);

  if (!entry || entry.resetAt <= now) {
    chatHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    // Opportunistic cleanup so the map can't grow without bound.
    if (chatHits.size > 5000) {
      chatHits.forEach((value, key) => {
        if (value.resetAt <= now) chatHits.delete(key);
      });
    }
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // POST /api/leads — public lead capture, mirrors production MarketingLeadCreate contract
  const leadRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 12,
    message: "Too many requests from this connection. Email Cory@HarborIQ.com and we'll pick it up there.",
  });

  app.post("/api/leads", leadRateLimit, async (req, res) => {
    try {
      const parsed = marketingLeadCreateSchema.parse(req.body);

      // Honeypot: if the hidden `website` field is filled, it's a bot.
      // Never store it — silently report success so the bot doesn't learn anything.
      if (parsed.website && parsed.website.trim().length > 0) {
        return res.status(201).json({
          ok: true,
          id: null,
          duplicate: false,
          message: "Thanks — we'll be in touch shortly.",
        });
      }

      const sinceIso = new Date(Date.now() - DEDUPE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
      const existing = await storage.findRecentByEmail(parsed.email, sinceIso);

      if (existing) {
        return res.status(201).json({
          ok: true,
          id: existing.id,
          duplicate: true,
          message: "We already have your request on file from the last 24 hours — our team will be in touch shortly.",
        });
      }

      const { website, ...insertData } = parsed;
      const lead = await storage.createLead(insertData);

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
      console.error("Error creating lead:", err);
      return res.status(500).json({
        ok: false,
        id: null,
        duplicate: false,
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  });

  // POST /api/leads/:id/enrich — attaches the optional Step 2 discovery answers
  // to a lead that was already created by the Step 1 submit.
  app.post("/api/leads/:id/enrich", leadRateLimit, async (req, res) => {
    const id = Number.parseInt(String(req.params.id), 10);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, id: null, message: "Invalid lead id." });
    }

    try {
      const patch = marketingLeadEnrichSchema.parse(req.body ?? {});
      const updated = await storage.enrichLead(id, patch);

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
      console.error("Error enriching lead:", err);
      return res.status(500).json({
        ok: false,
        id: null,
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  });

  // POST /api/chat — grounded HarborIQ site assistant.
  // Credentials come from the server environment (llm-api:website preset) — never hardcoded.
  app.post("/api/chat", async (req, res) => {
    const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || "unknown").trim();

    if (rateLimited(ip)) {
      return res.status(429).json({
        ok: false,
        reply: "You've hit the message limit for now. Email Cory@HarborIQ.com and we'll pick it up there.",
      });
    }

    try {
      const { messages } = chatRequestSchema.parse(req.body);
      // Keep only the most recent turns so context stays bounded.
      const history = messages.slice(-20);

      const client = new Anthropic();
      const completion = await client.messages.create({
        model: CHAT_MODEL,
        max_tokens: CHAT_MAX_TOKENS,
        system: ASSISTANT_SYSTEM_PROMPT,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      });

      const reply = completion.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("\n")
        .trim();

      if (!reply) {
        return res.status(502).json({
          ok: false,
          reply: "Our assistant didn't have an answer for that. Email Cory@HarborIQ.com and we'll help.",
        });
      }

      return res.status(200).json({ ok: true, reply });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ ok: false, reply: "That message couldn't be read. Please try again." });
      }
      console.error("Error in /api/chat:", err);
      return res.status(503).json({
        ok: false,
        reply: "Our assistant is offline right now — email Cory@HarborIQ.com and we'll answer personally.",
      });
    }
  });

  // GET /api/leads — admin-gated, matches production Authorization: Bearer contract
  app.get("/api/leads", async (req, res) => {
    const authHeader = req.header("authorization") || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token || token !== ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const leads = await storage.getAllLeads();
    return res.status(200).json({ ok: true, leads });
  });

  return httpServer;
}
