import type { ReactNode } from "react";
import { Anchor, Info } from "lucide-react";

/**
 * Shared chrome + primitives for the HarborIQ product preview mockups.
 *
 * These are pure React/Tailwind renderings of HarborIQ interface surfaces — not
 * screenshots, and not live customer data. Every frame carries an honest
 * "Product preview" label and every dataset is clearly illustrative sample data.
 * They render dark regardless of site theme, matching the app's dark-first UI.
 */

export type Tone = "cyan" | "amber" | "green" | "slate" | "red" | "violet";

const toneMap: Record<Tone, string> = {
  cyan: "border-teal-400/30 bg-teal-400/10 text-teal-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  slate: "border-white/15 bg-white/5 text-white/70",
  red: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-200",
};

const dotMap: Record<Tone, string> = {
  cyan: "bg-teal-400",
  amber: "bg-amber-400",
  green: "bg-emerald-400",
  slate: "bg-white/40",
  red: "bg-rose-400",
  violet: "bg-violet-400",
};

export interface PreviewFrameProps {
  /** Short label of the surface, e.g. "Operations dashboard". */
  title: string;
  /** One-line description of what a viewer is looking at. */
  caption?: string;
  /** Fake app chrome variant. */
  chrome?: "desktop" | "mobile";
  children: ReactNode;
  className?: string;
  testId?: string;
}

/**
 * Wraps a mockup in app chrome plus the honest "Product preview" badge.
 * The badge is required on every mockup — never remove it.
 */
export function PreviewFrame({
  title,
  caption,
  chrome = "desktop",
  children,
  className = "",
  testId,
}: PreviewFrameProps) {
  const isMobile = chrome === "mobile";

  return (
    <figure
      className={`not-prose m-0 ${className}`}
      data-testid={testId ?? `preview-${slug(title)}`}
    >
      <div
        className={`on-dark overflow-hidden rounded-xl border border-white/10 bg-brand-950 shadow-2xl ring-1 ring-inset ring-white/5 ${
          isMobile ? "mx-auto max-w-[320px] rounded-[1.75rem]" : ""
        }`}
      >
        {/* Window bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-brand-900/80 px-3 py-2.5">
          {isMobile ? (
            <>
              <span className="h-1.5 w-10 rounded-full bg-white/20" aria-hidden="true" />
              <span className="ml-auto font-mono text-[10px] text-white/60">9:41</span>
            </>
          ) : (
            <>
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </span>
              <span className="flex min-w-0 items-center gap-1.5 rounded-md bg-black/30 px-2.5 py-1 font-mono text-[10px] text-white/45">
                <Anchor className="h-3 w-3 shrink-0 text-teal-400/70" aria-hidden="true" />
                <span className="truncate">app.harboriq.com/{slug(title)}</span>
              </span>
            </>
          )}
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
            Product preview
          </span>
        </div>

        <div className="bg-[radial-gradient(circle_at_top_right,rgba(31,166,160,0.10),transparent_55%)]">
          {children}
        </div>
      </div>

      {/* Caption sits on the page surface, which may be light or dark, so its color is
          resolved in CSS from the nearest `.on-dark` section rather than hard-coded. */}
      <figcaption className="preview-caption mt-3 flex items-start gap-2 text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          <span className="preview-caption-title font-medium">{title}</span>
          {caption ? ` — ${caption}` : ""} Illustrative interface preview with sample data, not a live
          customer deployment.
        </span>
      </figcaption>
    </figure>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* ---------------------------------------------------------------- primitives */

export function AppShell({
  nav,
  active,
  children,
  header,
}: {
  nav: { label: string; icon: React.ComponentType<{ className?: string }> }[];
  active: string;
  children: ReactNode;
  header: ReactNode;
}) {
  return (
    <div className="flex min-h-[420px] text-white">
      <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-white/8 bg-brand-950/70 p-3 sm:flex">
        <div className="mb-3 flex items-center gap-2 px-1.5">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-teal-500/20 text-teal-300">
            <Anchor className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight">HarborIQ</span>
        </div>
        {nav.map((item) => {
          const isActive = item.label === active;
          return (
            <span
              key={item.label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                isActive
                  ? "bg-white/10 font-semibold text-white"
                  : "text-white/55"
              }`}
            >
              <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-teal-300" : "text-white/60"}`} aria-hidden="true" />
              {item.label}
            </span>
          );
        })}
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/8 px-4 py-3">{header}</div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function Pill({ tone = "slate", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium ${toneMap[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotMap[tone]}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function Metric({
  label,
  value,
  sub,
  tone = "cyan",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
}) {
  const accent = tone === "amber" ? "text-amber-300" : tone === "green" ? "text-emerald-300" : "text-teal-300";
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-wide text-white/60">{label}</p>
      <p className={`mt-1.5 font-display text-lg font-bold leading-none ${accent}`}>{value}</p>
      {sub && <p className="mt-1.5 text-[10px] text-white/45">{sub}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-white/8 bg-white/[0.02] ${className}`}>
      <header className="flex items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{title}</h4>
        {action}
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

export function Avatar({ initials, tone = "cyan" }: { initials: string; tone?: Tone }) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[9px] font-bold ${toneMap[tone]}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/** Deterministic bar chart — no library, no randomness, no layout shift. */
export function BarSeries({
  data,
  labels,
  tone = "cyan",
}: {
  data: number[];
  labels: string[];
  tone?: Tone;
}) {
  const max = Math.max(...data, 1);
  const fill = tone === "amber" ? "bg-amber-400/70" : "bg-teal-400/70";
  return (
    <div className="flex h-24 items-end gap-1.5" role="img" aria-label="Sample weekly revenue trend">
      {data.map((v, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div
            className={`w-full rounded-t ${fill}`}
            style={{ height: `${Math.max(6, (v / max) * 72)}px` }}
          />
          <span className="truncate text-[9px] text-white/60">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function ProgressTrack({ pct, tone = "cyan" }: { pct: number; tone?: Tone }) {
  const fill = tone === "amber" ? "bg-amber-400" : tone === "green" ? "bg-emerald-400" : "bg-teal-400";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

/** Reusable "AI suggested" callout — always labelled as a suggestion, never a guarantee. */
export function AiNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-violet-400/25 bg-violet-400/10 px-2.5 py-2 text-[11px] leading-snug text-violet-100">
      <span className="mt-0.5 rounded bg-violet-400/20 px-1 font-mono text-[9px] font-bold uppercase text-violet-200">
        AI
      </span>
      <span>{children}</span>
    </div>
  );
}
