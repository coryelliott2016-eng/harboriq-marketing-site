/**
 * POST /api/chat — the HarborIQ site's grounded AI assistant.
 *
 * The credential is read from the ANTHROPIC_API_KEY environment variable set
 * on the Vercel project. Never hardcode a key here, and never echo it back in
 * any error path.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";
import { ZodError } from "zod";
import { chatRequestSchema } from "./_lib/schema.js";
import { ASSISTANT_SYSTEM_PROMPT } from "./_lib/assistant-prompt.js";
import { applySecurityHeaders, getClientIp, rateLimited, readJson } from "./_lib/http.js";

// claude-haiku-4-5 is the fast, cheap Anthropic model that fits a short,
// grounded marketing-site assistant. The public model identifier uses hyphens.
const CHAT_MODEL = "claude-haiku-4-5";
const CHAT_MAX_TOKENS = 700;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, reply: "Method Not Allowed" });
  }

  const ip = getClientIp(req);
  if (rateLimited("chat", ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return res.status(429).json({
      ok: false,
      reply:
        "You've hit the message limit for now. Email Cory@HarborIQ.com and we'll pick it up there.",
    });
  }

  try {
    const raw = await readJson(req);
    const { messages } = chatRequestSchema.parse(raw);
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        ok: false,
        reply: "Our assistant is temporarily unavailable. Please call 941-210-1663 for help.",
      });
    }
    // Bound context by keeping only the last 20 turns.
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
    if (err instanceof ZodError || err instanceof SyntaxError) {
      return res.status(400).json({ ok: false, reply: "That message couldn't be read. Please try again." });
    }
    console.error("chat_request_failed");
    return res.status(503).json({
      ok: false,
      reply:
        "Our assistant is offline right now — email Cory@HarborIQ.com and we'll answer personally.",
    });
  }
}
