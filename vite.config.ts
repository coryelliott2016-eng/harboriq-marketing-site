import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

/**
 * Public origin for canonical/OG URLs, sitemap and robots.
 *
 * Precedence:
 *   1. SITE_URL            — explicit override (set on the Vercel project).
 *   2. Vercel previews     — the deployment's own URL, marked noindex.
 *   3. https://harboriq.com — the canonical production domain.
 *
 * Until the harboriq.com zone is recovered the production project sets
 * SITE_URL to the public alias so canonical links never point at a 401.
 */
function resolveSiteOrigin(): { origin: string; indexable: boolean } {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return { origin: explicit.replace(/\/+$/, ""), indexable: true };
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return { origin: `https://${process.env.VERCEL_URL}`, indexable: false };
  }
  return { origin: "https://harboriq.com", indexable: true };
}

/** Indexable routes, kept in sync with the <Switch> in client/src/App.tsx. */
const SITEMAP_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/features", changefreq: "monthly", priority: "0.9" },
  { path: "/solutions/mobile-mechanics", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/boatyards", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/marinas", changefreq: "monthly", priority: "0.8" },
  { path: "/security", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/resources/release-log", changefreq: "weekly", priority: "0.6" },
  { path: "/resources/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/demo", changefreq: "monthly", priority: "0.9" },
  { path: "/investors", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
];

function siteMetadataPlugin(): Plugin {
  const { origin, indexable } = resolveSiteOrigin();
  const outDir = path.resolve(import.meta.dirname, "dist/public");
  return {
    name: "harboriq-site-metadata",
    config: () => ({ define: { "import.meta.env.VITE_SITE_ORIGIN": JSON.stringify(origin) } }),
    transformIndexHtml(html) {
      let out = html.replaceAll("__SITE_ORIGIN__", origin);
      if (!indexable) {
        out = out.replace(
          '<meta name="robots" content="index, follow" />',
          '<meta name="robots" content="noindex, nofollow" />',
        );
      }
      return out;
    },
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = SITEMAP_ROUTES.map(
        (r) =>
          `  <url>\n    <loc>${origin}${r.path === "/" ? "/" : r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
      ).join("\n");
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      const robots = indexable
        ? `User-agent: *\nAllow: /\n\n# The admin lead dashboard is unlisted and token-gated; keep it out of indexes.\nDisallow: /team\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`
        : `User-agent: *\nDisallow: /\n`;
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
      writeFileSync(path.join(outDir, "robots.txt"), robots);
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMetadataPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  // Absolute base: the site now uses real paths (/solutions/marinas), so
  // relative asset URLs would resolve against the route and 404.
  base: "/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
