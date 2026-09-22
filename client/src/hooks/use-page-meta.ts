import { useEffect } from "react";

const SITE_NAME = "HarborIQ";
const SITE_ORIGIN = "https://harboriq.com";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface PageMeta {
  /** Page title without the site suffix, e.g. "Pricing". Omit on the home page. */
  title?: string;
  /** Meta description for this route. */
  description: string;
  /** Route path used to build the canonical URL, e.g. "/pricing". */
  path?: string;
}

/**
 * Per-route document title + meta description. Keeps Open Graph / Twitter
 * titles and the canonical link in sync so shared links reflect the page.
 */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : "HarborIQ — The Operating System for Marine Service Businesses";

    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    const canonical = path && path !== "/" ? `${SITE_ORIGIN}/#${path}` : `${SITE_ORIGIN}/`;
    setLink("canonical", canonical);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
  }, [title, description, path]);
}
