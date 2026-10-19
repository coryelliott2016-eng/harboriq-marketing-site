/**
 * Public origin used for canonical URLs, Open Graph URLs and JSON-LD.
 *
 * Resolved at build time by `vite.config.ts` (see `resolveSiteOrigin`) and
 * injected as `import.meta.env.VITE_SITE_ORIGIN`, so the same value drives
 * index.html, sitemap.xml, robots.txt and the per-route meta hooks. Falls back
 * to the canonical production domain if the build did not set it.
 */
export const SITE_ORIGIN: string =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined)?.replace(/\/+$/, "") ||
  "https://harboriq.com";

/** Absolute canonical URL for a route path such as "/pricing". */
export function canonicalFor(path: string): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
