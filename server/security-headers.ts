import type { Express, Request, Response, NextFunction } from "express";

/**
 * Security headers for the HarborIQ marketing site.
 *
 * Deliberate omissions:
 * - No `X-Frame-Options` and no CSP `frame-ancestors`. The site is served inside
 *   an iframe preview (`/computer/a/...`), and both directives would blank it.
 *   Framing protection is therefore intentionally left to the hosting layer.
 * - No HSTS: TLS termination is handled by the platform/host, and emitting HSTS
 *   from an app that can be served over plain HTTP in preview is a footgun.
 *
 * CSP notes: Vite injects inline <style> during dev and the built CSS is a
 * separate file, but shadcn/Radix set inline styles on elements, so
 * 'unsafe-inline' is required for style-src. Fontshare serves the CSS + font
 * files. In development Vite needs 'unsafe-inline'/'unsafe-eval' for HMR, so the
 * script policy is relaxed only when NODE_ENV !== 'production'.
 */
export function securityHeaders(app: Express) {
  const isProd = process.env.NODE_ENV === "production";

  const scriptSrc = isProd
    ? ["'self'", "'unsafe-inline'"] // inline JSON-LD blocks in index.html
    : ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"];

  const connectSrc = isProd
    ? ["'self'"]
    : ["'self'", "ws:", "wss:"]; // Vite HMR socket

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `script-src ${scriptSrc.join(" ")}`,
    `style-src 'self' 'unsafe-inline' https://api.fontshare.com https://cdn.fontshare.com`,
    `font-src 'self' data: https://api.fontshare.com https://cdn.fontshare.com`,
    `img-src 'self' data: blob:`,
    `connect-src ${connectSrc.join(" ")}`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
    `frame-src 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const permissionsPolicy = [
    "accelerometer=()",
    "camera=()",
    "geolocation=()",
    "gyroscope=()",
    "magnetometer=()",
    "microphone=()",
    "payment=()",
    "usb=()",
    "interest-cohort=()",
  ].join(", ");

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Content-Security-Policy", csp);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", permissionsPolicy);
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.removeHeader("X-Powered-By");
    next();
  });
}

/**
 * Fixed-window per-IP rate limiter for public write endpoints.
 * In-memory by design: this site runs as a single Node process and we add no
 * new dependency for it. Returns an Express middleware.
 */
export function rateLimit(opts: { windowMs: number; max: number; message: string }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || "unknown").trim();
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + opts.windowMs });
      if (hits.size > 5000) {
        hits.forEach((v, k) => {
          if (v.resetAt <= now) hits.delete(k);
        });
      }
      return next();
    }

    entry.count += 1;
    if (entry.count > opts.max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000).toString());
      return res.status(429).json({ ok: false, id: null, duplicate: false, message: opts.message });
    }
    return next();
  };
}
