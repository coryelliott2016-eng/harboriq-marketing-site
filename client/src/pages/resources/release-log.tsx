import { usePageMeta } from "@/hooks/use-page-meta";
import { SiteLayout } from "@/components/layout/site-layout";
import { releasePhases } from "@/lib/release-log-data";
import { CheckCircle2 } from "lucide-react";

export default function ReleaseLog() {
  usePageMeta({
    title: "Release Log",
    description: "All 17 shipped HarborIQ build phases in plain English, from multi-tenant foundations through dispatch scoring, Stripe billing, and the customer portal.",
    path: "/resources/release-log",
  });

  return (
    <SiteLayout>
      <section className="bg-brand-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Resources · Release Log</span>
          <h1 className="mt-4 text-xl font-display font-bold text-white">17 build phases, in plain English</h1>
          <p className="mt-4 text-base text-white/70">
            HarborIQ has been built in 17 phases. Here's what shipped in each, without the engineering jargon.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ol className="relative flex flex-col gap-8 border-l border-card-border pl-8">
            {releasePhases.map((r) => (
              <li key={r.phase} className="relative" data-testid={`item-release-phase-${r.phase}`}>
                <span className="absolute -left-[calc(2rem+1px)] flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Phase {r.phase}</span>
                  <h2 className="text-base font-semibold text-foreground">{r.title}</h2>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
