import test from "node:test";
import assert from "node:assert/strict";
import health from "../.api-build/health.js";
import chat from "../.api-build/chat.js";
import leads from "../.api-build/leads/index.js";
import enrich from "../.api-build/leads/[id]/enrich.js";
import leadStatus from "../.api-build/lead-status.js";

// Test emitted JavaScript, not tsx: an ESM/CommonJS mismatch must fail here.
for (const key of ["DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING", "ANTHROPIC_API_KEY"]) delete process.env[key];
process.env.ADMIN_TOKEN = "test-only-admin";
let sequence = 0;
async function call(handler, method, body, extra = {}) {
  const req = { method, body, headers: { "x-forwarded-for": `test-${++sequence}` }, query: {}, ...extra };
  const res = {
    statusCode: 200, headers: {}, body: null,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; return this; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler(req, res);
  return res;
}
const validLead = { fullName: "Synthetic Test", businessName: "Synthetic Test",
  email: "runtime-test@example.invalid", teamSize: "solo", source: "regression-test" };

test("public availability hides storage diagnostics and fails closed", async () => {
  const r = await call(leadStatus, "GET");
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.body, { available: false });
  assert.equal(r.headers["cache-control"], "no-store");
  assert.equal((await call(leadStatus, "POST")).statusCode, 405);
});
test("health imports under native ESM and returns no-store JSON", async () => {
  const r = await call(health, "GET");
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.ok, true);
  assert.equal(r.headers["cache-control"], "no-store");
});
test("health rejects writes", async () => {
  assert.equal((await call(health, "POST")).statusCode, 405);
});
test("admin lead list fails closed without authentication", async () => {
  assert.equal((await call(leads, "GET")).statusCode, 401);
});
test("admin list reports unavailable storage, not an empty success", async () => {
  const r = await call(leads, "GET", null, { headers: { authorization: "Bearer test-only-admin" } });
  assert.equal(r.statusCode, 503);
  assert.equal(r.body.ok, false);
});
test("lead validation rejects invalid and malformed requests", async () => {
  assert.equal((await call(leads, "POST", {})).statusCode, 400);
  assert.equal((await call(leads, "POST", "{")).statusCode, 400);
});
test("lead without durable storage fails safely and never logs its PII", async () => {
  const logs = [];
  const previous = console.warn;
  console.warn = (...args) => logs.push(args);
  try {
    const r = await call(leads, "POST", validLead);
    assert.equal(r.statusCode, 503);
    assert.equal(r.body.ok, false);
    assert.equal(r.body.id, null);
    assert.equal(logs.length, 0);
  } finally { console.warn = previous; }
});
test("honeypot does not store a lead", async () => {
  const r = await call(leads, "POST", { ...validLead, website: "bot.example" });
  assert.equal(r.statusCode, 201);
  assert.equal(r.body.id, null);
});
test("chat validates requests before checking the provider", async () => {
  assert.equal((await call(chat, "POST", { messages: [] })).statusCode, 400);
  assert.equal((await call(chat, "POST", "{")).statusCode, 400);
});
test("chat without provider returns a controlled 503", async () => {
  const r = await call(chat, "POST", { messages: [{ role: "user", content: "Hello" }] });
  assert.equal(r.statusCode, 503);
  assert.equal(r.body.ok, false);
});
test("unsupported methods return 405", async () => {
  assert.equal((await call(chat, "GET")).statusCode, 405);
  assert.equal((await call(leads, "DELETE")).statusCode, 405);
  assert.equal((await call(enrich, "GET")).statusCode, 405);
});
test("enrichment rejects ambiguous IDs and missing storage", async () => {
  for (const id of ["1junk", "0", "-1", "9007199254740993"]) {
    assert.equal((await call(enrich, "POST", {}, { query: { id } })).statusCode, 400);
  }
  assert.equal((await call(enrich, "POST", {}, { query: { id: "1" } })).statusCode, 503);
});
test("lead rate limiter blocks repeated requests on a warm instance", async () => {
  const headers = { "x-forwarded-for": "rate-limit-test" };
  for (let i = 0; i < 12; i++) await call(leads, "POST", {}, { headers });
  assert.equal((await call(leads, "POST", {}, { headers })).statusCode, 429);
});
