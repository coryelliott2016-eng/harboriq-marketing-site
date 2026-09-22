import { usePageMeta } from "@/hooks/use-page-meta";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pricingTiers } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { Check, X } from "lucide-react";

const ANNUAL_DISCOUNT = 0.83; // ~2 months free

const comparisonRows: { label: string; values: (boolean | string)[] }[] = [
  { label: "CRM & job history", values: [true, true, true, true] },
  { label: "Invoicing with Stripe", values: [true, true, true, true] },
  { label: "AI-assisted dispatch", values: [false, true, true, true] },
  { label: "Offline PWA field app", values: [false, true, true, true] },
  { label: "Customer portal", values: ["Read-only", "Interactive", "Interactive", "Interactive"] },
  { label: "Marina & slip management", values: [false, false, true, true] },
  { label: "Accounting & reporting exports", values: [false, false, true, true] },
  { label: "SSO & advanced RBAC", values: [false, false, false, true] },
  { label: "Dedicated support & custom SLAs", values: [false, false, false, true] },
];

export default function Pricing() {
  usePageMeta({
    title: "Pricing — Marine Service Management Software",
    description: "Draft HarborIQ pricing: Solo $79, Team $199, Business $399 per month, and custom Enterprise plans. Pricing is a framework and subject to change before general availability.",
    path: "/pricing",
  });

  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    track("pricing_view", { path: "/pricing" });
  }, []);

  return (
    <SiteLayout>
      <section className="bg-brand-900 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Pricing</span>
          <h1 className="mt-4 text-xl font-display font-bold text-white">Simple plans that match your team size</h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-white/70">
            Proposed pricing framework — a starting point, not a final published rate card.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5">
            <span className={`text-sm ${!annual ? "text-white font-medium" : "text-white/60"}`}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" data-testid="switch-billing-period" />
            <span className={`text-sm ${annual ? "text-white font-medium" : "text-white/60"}`}>
              Annual <span className="text-amber-400">(2 months free)</span>
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {pricingTiers.map((tier) => {
              const price = tier.monthly === null ? null : annual ? Math.round(tier.monthly * ANNUAL_DISCOUNT) : tier.monthly;
              return (
                <Card
                  key={tier.id}
                  className={`relative flex h-full flex-col ${tier.highlighted ? "border-amber-500 ring-1 ring-amber-500/40" : ""}`}
                  data-testid={`card-pricing-${tier.id}`}
                >
                  {tier.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-brand-950 hover:bg-amber-500">
                      Most popular
                    </Badge>
                  )}
                  <CardContent className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground min-h-10">{tier.positioning}</p>
                    <div className="mt-4">
                      {price === null ? (
                        <span className="text-xl font-display font-bold text-foreground">Custom</span>
                      ) : (
                        <>
                          <span className="text-xl font-display font-bold text-foreground" data-testid={`text-price-${tier.id}`}>
                            ${price}
                          </span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </>
                      )}
                    </div>
                    <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="mt-6"
                      variant={tier.highlighted ? "default" : "outline"}
                      data-testid={`button-choose-${tier.id}`}
                      onClick={() =>
                        track("demo_cta_click", { location: "pricing_card", plan: tier.id })
                      }
                    >
                      <Link href={`/demo?team_size=${tier.id}`}>{tier.monthly === null ? "Contact sales" : "Get a Demo"}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            Early-access pricing. It is a draft framework, subject to change before general
            availability. Card payments are processed by Stripe; HarborIQ never stores card numbers.
          </p>
        </div>
      </section>

      <section id="comparison" className="py-16 sm:py-24 bg-muted/40 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-display font-bold text-foreground">Compare plans</h2>
          <div
            className="mt-8 overflow-x-auto rounded-lg border border-card-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            tabIndex={0}
            role="group"
            aria-label="Plan comparison table — scroll horizontally"
          >
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-56">Capability</TableHead>
                  {pricingTiers.map((t) => (
                    <TableHead key={t.id} className="text-center">{t.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                    {row.values.map((v, i) => (
                      <TableCell key={i} className="text-center">
                        {typeof v === "string" ? (
                          <span className="text-sm text-muted-foreground">{v}</span>
                        ) : v ? (
                          <>
                            <Check className="mx-auto h-4 w-4 text-teal-700" aria-hidden="true" />
                            <span className="sr-only">Included</span>
                          </>
                        ) : (
                          <>
                            <X className="mx-auto h-4 w-4 text-muted-foreground/40" aria-hidden="true" />
                            <span className="sr-only">Not included</span>
                          </>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
