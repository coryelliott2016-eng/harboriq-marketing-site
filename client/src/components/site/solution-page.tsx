import { useEffect } from "react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductTour } from "@/components/product/product-tour";
import { track } from "@/lib/analytics";
import { useBreadcrumbs } from "@/hooks/use-structured-data";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";

export interface SolutionPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  painPoints: { title: string; body: string }[];
  capabilities: { icon: LucideIcon; title: string; body: string }[];
  source: string;
  /** Product-tour surface ids most relevant to this audience. */
  previewSurfaces?: string[];
  /** Heading above the embedded previews. */
  previewHeading?: string;
}

export function SolutionPage({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  painPoints,
  capabilities,
  source,
  previewSurfaces,
  previewHeading = "The screens you'd live in",
}: SolutionPageProps) {
  useBreadcrumbs(`solution-${source}`, [
    { name: "Solutions", path: "/solutions/mobile-mechanics" },
    { name: eyebrow.replace(/^Solutions\s*·\s*/i, ""), path: `/solutions/${source}` },
  ]);

  useEffect(() => {
    track("solution_page_view", { solution: source });
  }, [source]);

  return (
    <SiteLayout>
      <section className="on-dark relative overflow-hidden bg-brand-900">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          width={2400}
          height={1350}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/85 to-brand-900/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">{eyebrow}</span>
          <h1 className="mt-4 max-w-2xl font-display text-xl font-bold text-white">{title}</h1>
          <p className="mt-4 max-w-xl text-base text-white/75">{intro}</p>
          <Button
            asChild
            size="lg"
            className="mt-8"
            data-testid="button-solution-demo"
            onClick={() => track("demo_cta_click", { location: `solution_hero_${source}` })}
          >
            <Link href="/demo">
              Get a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-lg font-bold text-foreground">
            What&apos;s slowing you down today
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {painPoints.map((p) => (
              <Card key={p.title}>
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {previewSurfaces && previewSurfaces.length > 0 && (
        <section className="on-dark bg-brand-950 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-lg font-bold text-white">{previewHeading}</h2>
            <p className="mt-3 max-w-2xl text-base text-white/60">
              Interface previews with sample data — HarborIQ is pre-pilot, so nothing here is a real
              customer&apos;s account.
            </p>
            <ProductTour source={`solutions/${source}`} surfaceIds={previewSurfaces} className="mt-8" />
          </div>
        </section>
      )}

      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-lg font-bold text-foreground">How HarborIQ helps</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {capabilities.map((c) => (
              <div key={c.title} className="flex gap-4">
                <c.icon className="h-6 w-6 shrink-0 text-teal-700" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <CheckCircle2 className="mx-auto h-8 w-8 text-teal-700" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-bold text-foreground">
            See it with your own jobs
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            We&apos;ll walk through HarborIQ using workflows that match how you actually operate — and
            early-access pilot spots are limited.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              data-testid={`button-solution-cta-${source}`}
              onClick={() => track("demo_cta_click", { location: `solution_footer_${source}` })}
            >
              <Link href="/demo">
                Get a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid={`button-solution-pricing-${source}`}
              onClick={() => track("pricing_view", { location: `solution_footer_${source}` })}
            >
              <Link href="/pricing">See plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
