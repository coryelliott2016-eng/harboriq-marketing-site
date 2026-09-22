import type { VercelRequest, VercelResponse } from "@vercel/node";
import { applySecurityHeaders } from "./_lib/http.js";
import { checkLeadStorage } from "./_lib/storage.js";

/** Public capability check. No credentials, records, or diagnostic details. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }
  try {
    return res.status(200).json({ available: await checkLeadStorage() });
  } catch {
    return res.status(200).json({ available: false });
  }
}
