import { usePageMeta } from "@/hooks/use-page-meta";
import { SiteLayout } from "@/components/layout/site-layout";
import { Link } from "wouter";
import { Compass, Anchor, ShieldCheck, BadgeCheck, Wrench, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import founderImage from "@/assets/founder-portrait.jpg";
import dockImage from "@/assets/founder-on-water.jpg";

export default function About() {
  usePageMeta({
    title: "About",
    description: "HarborIQ was built by Cory Elliott, an ABYC-certified marine technician behind Off the Hook Marine Specialist in Sarasota, Florida — software written from inside the trade.",
    path: "/about",
  });

  return (
    <SiteLayout>
      <section className="bg-brand-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">About</span>
          <h1 className="mt-4 text-xl font-display font-bold text-white">
            Built by someone who kept hearing the same complaint from the docks
          </h1>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:items-start">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-base text-muted-foreground">
                HarborIQ is built and maintained by Cory Elliott. The product started from a simple
                observation: marine service businesses — mobile mechanics, boatyards, and marinas —
                were running on notebooks, text threads, and spreadsheets, while the software built
                for other trades didn't fit how marine work actually happens: intermittent
                connectivity, vessel-specific history, and slip-based logistics that generic
                field-service tools don't model well.
              </p>
              <p className="text-base text-muted-foreground mt-4">
                That observation wasn't secondhand. Cory is an ABYC-certified marine service
                technician and runs{" "}
                <span className="font-semibold text-foreground">Off the Hook Marine Specialist</span>,
                a mobile marine repair business in Sarasota, Florida — dockside electrical work,
                repowers, and diagnostics on other people's boats, on other people's schedules.
              </p>
              <p className="text-base text-muted-foreground mt-4">
                HarborIQ was built to be marine-specific from the ground up — CRM, explainable
                dispatch, Stripe-based invoicing, marina and slip management, an offline field app,
                and a customer portal, all built to a Zero-Trust, OWASP ASVS Level 3 security
                standard from the start rather than retrofitted later.
              </p>
              <p className="text-base text-muted-foreground mt-4">
                The mission is straightforward: give marine service businesses of any size — from a
                solo mobile mechanic to a multi-slip marina — one system that actually understands
                how their work is structured.
              </p>
            </div>
            <div className="rounded-xl border border-card-border overflow-hidden">
              <img
                src={founderImage}
                alt="Cory Elliott, founder and CEO of HarborIQ, at Spartan College of Aeronautics and Technology"
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
                data-testid="img-founder-portrait"
              />
            </div>
          </div>

          {/* Off the Hook — origin story */}
          <div
            id="off-the-hook"
            className="mt-16 scroll-mt-20 overflow-hidden rounded-xl border border-white/10 bg-brand-950"
          >
            <div>
              <div className="relative h-48 sm:h-64">
                <img
                  src={dockImage}
                  alt="Founder Cory Elliott at the helm on the water near Sarasota, Florida"
                  width={921}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
              </div>
              <div className="p-6 sm:p-10">
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                  Born at the dock
                </span>
                <h2 className="mt-4 text-xl font-display font-bold text-white">
                  Off the Hook Marine Specialist — where the workflows came from
                </h2>
                <p className="mt-4 text-base text-white/70">
                  Running a mobile repair business means the paperwork problem is not theoretical.
                  Vessel history lived in a notebook in the van. Job notes were a photo and a text
                  thread. Invoices were written up at the kitchen table hours after the work was
                  finished, from memory, with the hull ID guessed and the parts list half-remembered.
                  Every hour spent reconstructing a job was an hour not spent turning wrenches.
                </p>
                <p className="mt-4 text-base text-white/70">
                  HarborIQ started as the fix for that — built first for the founder's own shop.
                  Vessel records because you need last season's impeller change before you quote this
                  one. Work orders because a job is a sequence of findings, not a line item. Dispatch
                  because the route between three marinas decides whether the day works. Invoicing at
                  the dock because payment collected on-site is payment collected.
                </p>
                <p className="mt-4 text-base text-white/70">
                  Off the Hook remains the proving ground: every workflow shipped in HarborIQ was
                  shaped by real service calls before it was generalized into a platform for the rest
                  of the industry.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" data-testid="list-off-the-hook-chips">
                  {[
                    { icon: BadgeCheck, label: "ABYC-certified technician" },
                    { icon: Wrench, label: "Mobile marine repair" },
                    { icon: MapPin, label: "Sarasota, FL" },
                  ].map((chip) => (
                    <li
                      key={chip.label}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300"
                    >
                      <chip.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {chip.label}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 bg-white/5 text-white border-white/20 hover:bg-white/10"
                  data-testid="button-about-mobile-mechanics"
                >
                  <Link href="/solutions/mobile-mechanics">
                    See it for mobile mechanics <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <ValueCard icon={Compass} title="Marine-specific" body="Built around vessels, slips, and dock realities — not adapted from generic field service software." />
            <ValueCard icon={Anchor} title="Built to ship" body="17 build phases delivered — CRM, dispatch, invoicing, marina management, offline app, and portal, all working." />
            <ValueCard icon={ShieldCheck} title="Security-first" body="Zero Trust and OWASP ASVS Level 3 principles applied from the first phase, not bolted on at the end." />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ValueCard({ icon: Icon, title, body }: { icon: typeof Compass; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-card-border bg-card p-6">
      <Icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
