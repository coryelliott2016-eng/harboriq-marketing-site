import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { featurePillars } from "@/lib/features-data";
import { PRODUCT_PREVIEWS } from "@/components/product/product-tour";
import { track } from "@/lib/analytics";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import marinaImage from "@/assets/feature-marina-slips.jpg";

/**
 * Which interface preview illustrates each feature pillar. Pillars without a
 * dedicated surface fall back to the pillar icon rather than a misleading screen.
 */
const PILLAR_PREVIEW: Record<string, keyof typeof PRODUCT_PREVIEWS | undefined> = {
  crm: "workOrder",
  dispatch: "dispatch",
  invoicing: "billing",
  marina: "slips",
  "offline-app": "field",
  portal: "portal",
  accounting: "dashboard",
  security: undefined,
};

export default function Features() {
  usePageMeta({
    title: "Features — Marine Work Order & Dispatch Software",
    description: "Every HarborIQ capability in one place: marine CRM, explainable dispatch scoring, Stripe invoicing and Connect payouts, slip and mooring management, the offline field app, and the customer portal.",
    path: "/features",
  });

  return (
    <SiteLayout>
      <section className="bg-brand-900 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Features</span>
          <h1 className="mt-4 text-xl font-display font-bold text-white max-w-2xl">
            Every capability, tied to a real shipped feature
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/70">
            No roadmap promises — everything below is built and working across HarborIQ's CRM,
            dispatch, invoicing, marina, field app, and portal modules.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-20">
            {featurePillars.map((f, i) => (
              <div
                key={f.id}
                id={f.id}
                className="grid gap-8 lg:grid-cols-2 lg:items-center scroll-mt-24"
                data-testid={`section-feature-${f.id}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <f.icon className="h-8 w-8 text-teal-700" aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-display font-bold text-foreground">{f.title}</h2>
                  <p className="mt-2 text-base text-muted-foreground">{f.summary}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <FeatureVisual pillarId={f.id} icon={f.icon} className={i % 2 === 1 ? "lg:order-1" : ""} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-display font-bold text-foreground">Ready to see it running your jobs?</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Every screen above is an interface preview with sample data. Bring your own jobs and
            we&apos;ll walk the real thing.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8"
            data-testid="button-features-cta"
            onClick={() => track("demo_cta_click", { location: "features_footer" })}
          >
            <Link href="/demo">
              Get a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function FeatureVisual({
  pillarId,
  icon: Icon,
  className = "",
}: {
  pillarId: string;
  icon: (typeof featurePillars)[number]["icon"];
  className?: string;
}) {
  const previewKey = PILLAR_PREVIEW[pillarId];
  const Preview = previewKey ? PRODUCT_PREVIEWS[previewKey] : undefined;

  if (Preview) {
    return (
      <div className={className}>
        <Preview />
      </div>
    );
  }

  if (pillarId === "marina") {
    return (
      <div className={`overflow-hidden rounded-xl border border-card-border ${className}`}>
        <img
          src={marinaImage}
          alt="Aerial view of a marina with numbered slips"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-card-border bg-muted/40 ${className}`}
    >
      <Icon className="h-16 w-16 text-teal-700/25" aria-hidden="true" />
    </div>
  );
}
