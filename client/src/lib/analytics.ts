/**
 * Provider-agnostic analytics event layer.
 *
 * HarborIQ has not selected an analytics vendor yet, so this ships no third-party
 * script and no tracking IDs. Every event is pushed onto `window.__hiq_events`
 * and (in dev) logged. When a provider is chosen, forward the queue in ONE place:
 * `flushTo()` below — no call sites need to change.
 *
 * No cookies / localStorage / sessionStorage are used (sandbox-safe, and it keeps
 * the cookie policy honest: no analytics cookies are set today).
 */

export type AnalyticsEvent =
  | "demo_cta_click"
  | "pilot_cta_click"
  | "form_start"
  | "form_complete"
  | "pricing_view"
  | "product_tour_engagement"
  | "solution_page_view"
  | "outbound_contact_click"
  | "investor_page_view"
  | "investor_cta_click";

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  props: Record<string, string | number | boolean | undefined>;
  /** ms since navigation start — relative, not a timestamp, so no fingerprinting value. */
  t: number;
}

declare global {
  interface Window {
    __hiq_events?: AnalyticsPayload[];
    __hiq_sink?: (payload: AnalyticsPayload) => void;
  }
}

const MAX_QUEUE = 200;

export function track(
  event: AnalyticsEvent,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  if (typeof window === "undefined") return;

  const payload: AnalyticsPayload = {
    event,
    props,
    t: Math.round(typeof performance !== "undefined" ? performance.now() : 0),
  };

  const queue = (window.__hiq_events ||= []);
  queue.push(payload);
  if (queue.length > MAX_QUEUE) queue.splice(0, queue.length - MAX_QUEUE);

  // Optional runtime sink so a provider can be attached without a rebuild.
  try {
    window.__hiq_sink?.(payload);
  } catch {
    /* a broken sink must never break the page */
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }
}

/** Read-only snapshot of everything captured this session (used by QA). */
export function getEvents(): AnalyticsPayload[] {
  if (typeof window === "undefined") return [];
  return [...(window.__hiq_events ?? [])];
}

/**
 * Single integration point for a future provider (GA4, Plausible, PostHog…).
 * Call once at app start with a forwarder; the existing queue is replayed.
 */
export function flushTo(sink: (payload: AnalyticsPayload) => void): void {
  if (typeof window === "undefined") return;
  window.__hiq_sink = sink;
  (window.__hiq_events ?? []).forEach((p) => {
    try {
      sink(p);
    } catch {
      /* ignore */
    }
  });
}
