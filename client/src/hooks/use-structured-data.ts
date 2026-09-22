import { useEffect } from "react";

const SITE_ORIGIN = "https://harboriq.com";

/**
 * Injects a JSON-LD <script> into <head> for the lifetime of the mounted route.
 * Keyed by `id` so re-renders replace rather than duplicate, and removed on
 * unmount so a hash-route change never leaves stale structured data behind.
 */
export function useStructuredData(id: string, data: unknown): void {
  // Serialize outside the effect so an inline object literal doesn't retrigger it
  // on every render (the string is a stable dependency, the object is not).
  const json = JSON.stringify(data);

  useEffect(() => {
    const elementId = `ld-${id}`;
    let el = document.getElementById(elementId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = elementId;
      document.head.appendChild(el);
    }
    el.textContent = json;

    return () => {
      document.getElementById(elementId)?.remove();
    };
  }, [id, json]);
}

/** Canonical hash URL for a route, matching usePageMeta's canonical format. */
export function canonicalFor(path: string): string {
  const clean = path === "/" ? "" : path.replace(/^\//, "");
  return `${SITE_ORIGIN}/#/${clean}`;
}

/**
 * BreadcrumbList JSON-LD for nested routes.
 * Pass the trail without "Home" — it is prepended automatically.
 */
export function useBreadcrumbs(id: string, trail: { name: string; path: string }[]): void {
  const items = [{ name: "Home", path: "/" }, ...trail];
  useStructuredData(`breadcrumb-${id}`, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalFor(item.path),
    })),
  });
}
