import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoiCalculator } from "@/components/site/roi-calculator";
import { ProductTour } from "@/components/product/product-tour";
import { featurePillars } from "@/lib/features-data";
import { pricingTiers } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  ArrowRight,
  Anchor,
  Wrench,
  Building2,
  BadgeCheck,
  MapPin,
  ClipboardX,
  PhoneCall,
  Receipt,
  CalendarX2,
  Clock,
  TrendingUp,
  Smile,
  FileCheck2,
  UserPlus,
  Upload,
  Rocket,
  CreditCard,
  Mail,
  CheckCircle2,
} from "lucide-react";
import heroImage from "@/assets/hero-marina.jpg";
import fieldAppImage from "@/assets/feature-field-app.jpg";
import dockImage from "@/assets/founder-on-water.jpg";

/** Homepage FAQ subset — mirrors /resources/faq so the JSON-LD there stays canonical. */
const homeFaqs = [
  {
    q: "Is HarborIQ live and usable today?",
    a: "The platform is built and internally tested — 17 development phases complete with 824 automated tests — and HarborIQ is now opening a limited early-access pilot. It is pre-pilot, so there are no customer case studies or uptime statistics to publish yet, and we will not invent them.",
  },
  {
    q: "Does the field app really work offline?",
    a: "Yes. The field app is an installable progressive web app designed to keep working without a network connection and sync automatically once connectivity returns — built for marinas and remote job sites with poor coverage.",
  },
  {
    q: "How does invoicing and payment work?",
    a: "Approved estimates convert into invoices without re-entry, and payments run on Stripe including Stripe Connect and refunds. HarborIQ never stores card numbers.",
  },
  {
    q: "What security standard is HarborIQ built to?",
    a: "The architecture is built around Zero-Trust principles and the OWASP Application Security Verification Standard at Level 3, including tenant isolation via row-level security, MFA, encryption in transit and at rest, and audit logging. HarborIQ holds no third-party security certification today and does not claim one.",
  },
  {
    q: "Is the pricing on this site final?",
    a: "No. Plan pricing is draft early-access pricing and is subject to change before general availability.",
  },
  {
    q: "Who is building this?",
    a: "Cory Elliott — an ABYC-certified marine technician who built and ran Off the Hook Marine Specialist in Sarasota, worked at Cannons Marina, holds an MBA from CU Boulder's Leeds School of Business, and came out of aviation maintenance and airline operations.",
  },
];

export default function Home() {
  usePageMeta({
    description:
      "HarborIQ is the intelligent operating system for marine-service businesses: marine work orders, AI-assisted technician dispatch, Stripe invoicing, marina slip management, an offline field app, and a customer portal.",
    path: "/",
  });

  return (
    <SiteLayout>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="on-dark relative overflow-hidden bg-brand-900">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={2400}
          height={1350}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/88 to-brand-900/45" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              Marine work orders · AI dispatch · Invoicing · Slips
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold leading-[1.05] text-white">
              Run your entire marine-service business from one intelligent platform.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              HarborIQ is the operating system for mobile marine mechanics, boatyards, and marinas —
              work orders, AI-assisted dispatch, Stripe invoicing, and slip management, with an
              offline field app for when the dock has no signal.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                data-testid="button-hero-demo"
                onClick={() => track("demo_cta_click", { location: "home_hero" })}
              >
                <Link href="/demo">
                  Get a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                data-testid="button-hero-tour"
              >
                <button
                  type="button"
                  onClick={() => {
                    track("product_tour_engagement", { source: "home_hero", surface: "scroll_to_tour" });
                    document.getElementById("product-tour")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  See the product
                </button>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/55">
              {[
                "17 of 17 build phases complete",
                "824 automated tests",
                "Built to an OWASP ASVS Level 3 standard",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Product preview */}
      <section id="product-tour" className="on-dark scroll-mt-20 bg-brand-950 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">
              Inside the platform
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-white">
              This is what running your shop on HarborIQ looks like
            </h2>
            <p className="mt-3 text-base text-white/65">
              Eight of the interfaces your team would use every day. These are interface previews
              rendered with sample data — HarborIQ is pre-pilot, so we are not going to show you
              someone else&apos;s dashboard and call it a case study.
            </p>
          </div>
          <ProductTour source="home" className="mt-10" />
        </div>
      </section>

      {/* ---------------------------------------------------------- Pain points */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground">
              The marine trades run on paper, texts, and memory. That doesn&apos;t scale.
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Every one of these is a day that costs you money — and none of them are a software
              problem until you try to grow past one truck.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ClipboardX,
                pain: "Job details live in a notebook",
                cost: "Work gets redone, parts get re-ordered, and warranty history disappears when the notebook does.",
              },
              {
                icon: Receipt,
                pain: "Invoices go out days late, by hand",
                cost: "Cash sits in a truck console instead of your account, and small line items never get billed at all.",
              },
              {
                icon: CalendarX2,
                pain: "A slip gets double-booked",
                cost: "Two calendars, two people, one berth — and an angry owner standing on the dock.",
              },
              {
                icon: PhoneCall,
                pain: "Owners call for status all day",
                cost: "Every interruption pulls a tech off a job and a dispatcher off the board.",
              },
            ].map((item) => (
              <Card key={item.pain} className="h-full" data-testid={`card-pain-${item.pain.slice(0, 12)}`}>
                <CardContent className="p-6">
                  <item.icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">{item.pain}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.cost}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Outcomes */}
      <section className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                What changes when the whole operation is in one system
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                HarborIQ replaces the spreadsheet stack with one connected system built specifically
                for marine service — not generic field-service software with &ldquo;boat&rdquo;
                pasted over &ldquo;HVAC unit.&rdquo;
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {[
                  {
                    icon: Clock,
                    title: "Less time on paperwork",
                    body: "The estimate, the work order, and the invoice are the same record — entered once, at the boat.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Revenue you were already owed",
                    body: "Engine-hour-driven service reminders surface work that used to be remembered only when a customer called.",
                  },
                  {
                    icon: Smile,
                    title: "Customers who stop chasing you",
                    body: "The portal answers 'any update on my boat?' with photos, status, and a pay button.",
                  },
                  {
                    icon: FileCheck2,
                    title: "A record that survives an argument",
                    body: "Photos, approvals, signatures, and a full audit log attached to every job.",
                  },
                ].map((o) => (
                  <li key={o.title} className="flex items-start gap-3">
                    <o.icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{o.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{o.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-muted-foreground">
                We describe outcomes, not percentages. HarborIQ is pre-pilot, so any efficiency
                figure we published today would be a guess — the ROI calculator below runs on{" "}
                <em>your</em> numbers instead.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-card-border">
              <img
                src={fieldAppImage}
                alt="A rugged tablet running the HarborIQ field app on a boat console while a mechanic works"
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Modules */}
      <section id="feature-pillars" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground">
              Everything a marine-service operation needs
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Every capability below is a built, tested part of the platform — not a roadmap promise.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featurePillars.map((f) => (
              <Card key={f.id} className="h-full" data-testid={`card-feature-${f.id}`}>
                <CardContent className="p-6">
                  <f.icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" data-testid="button-see-all-features">
              <Link href="/features">
                Explore every feature <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Audience routing */}
      <section className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold text-foreground">
            One product, built around how you work
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            The same core platform, framed for the three operations that make up most of the marine
            service market.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <SolutionCard
              icon={Wrench}
              title="Mobile Marine Mechanics"
              description="Dispatch, invoice, and collect payment from the dock or the driveway — even with no signal."
              href="/solutions/mobile-mechanics"
            />
            <SolutionCard
              icon={Anchor}
              title="Boatyards"
              description="Track haul-outs, storage, and multi-tech jobs from a single dispatch board."
              href="/solutions/boatyards"
            />
            <SolutionCard
              icon={Building2}
              title="Marinas"
              description="Slip assignments, lease billing, and tenant communication in one map."
              href="/solutions/marinas"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- How it works */}
      <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground">
              How onboarding actually goes
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Early-access pilots are run directly by the founder, so there is no handoff to a
              support queue that has never touched a boat.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: PhoneCall,
                step: "1 · Walkthrough",
                body: "A working session on your operation — how jobs come in, who dispatches, how you bill.",
              },
              {
                icon: Upload,
                step: "2 · Bring your data",
                body: "Customers, vessels, and open jobs imported from spreadsheets or your current tool.",
              },
              {
                icon: UserPlus,
                step: "3 · Configure & train",
                body: "Roles, rates, checklists, and slip inventory set up with your team, on your terms.",
              },
              {
                icon: Rocket,
                step: "4 · Run live",
                body: "Start with dispatch and invoicing, add slips and maintenance intelligence as you go.",
              },
            ].map((s) => (
              <li key={s.step}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <s.icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                    <h3 className="mt-4 text-base font-semibold text-foreground">{s.step}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------- Integrations */}
      <section className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold text-foreground">
            What HarborIQ connects to today
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            We list only what is actually wired up. If an integration isn&apos;t here, it isn&apos;t
            built yet.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: CreditCard,
                title: "Stripe",
                body: "Payments, Stripe Connect, refunds, and subscription billing. Card data never touches HarborIQ.",
              },
              {
                icon: Mail,
                title: "Email & SMS notifications",
                body: "Estimate approvals, job status, and invoice reminders sent to owners automatically.",
              },
              {
                icon: FileCheck2,
                title: "Accounting exports",
                body: "Invoice and payment exports for your bookkeeper, on Business and Enterprise plans.",
              },
            ].map((i) => (
              <Card key={i.title} className="h-full">
                <CardContent className="p-6">
                  <i.icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">{i.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------- Credibility / founder proof */}
      <section id="born-at-the-dock" className="on-dark scroll-mt-20 bg-brand-950 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                Born at the dock
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-white">
                HarborIQ wasn&apos;t designed in an office. It was designed at the dock.
              </h2>
              <p className="mt-4 text-base text-white/70">
                HarborIQ is built by the ABYC-certified marine technician behind{" "}
                <span className="font-semibold text-white">Off the Hook Marine Specialist</span>, his
                own mobile marine repair business in Sarasota, Florida. Vessel records, work orders,
                dispatch, and invoicing were shaped by real service calls — electrical diagnostics,
                repowers, dockside repairs — not by guesses about how the trade works.
              </p>
              <p className="mt-4 text-base text-white/70">
                That shop is the proving ground for the workflows: if a screen doesn&apos;t survive a
                humid afternoon on a transom with greasy hands, it doesn&apos;t ship.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" data-testid="list-founder-chips">
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
                className="mt-8 border-white/20 bg-white/5 text-white hover:bg-white/10"
                data-testid="button-founder-story"
              >
                <Link href="/about">
                  Read the founder&apos;s story <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <img
                src={dockImage}
                alt="Founder Cory Elliott at the helm on the water near Sarasota, Florida"
                width={921}
                height={1000}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- ROI calculator */}
      <section id="roi-calculator" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <RoiCalculator />
        </div>
      </section>

      {/* ------------------------------------------------------------- Security */}
      <section id="security-callout" className="on-dark scroll-mt-20 bg-brand-900 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <ShieldCheck className="mx-auto h-9 w-9 text-amber-400" aria-hidden="true" />
          <h2 className="mt-5 font-display text-xl font-bold text-white">
            Built to a Zero-Trust, OWASP ASVS Level 3 security standard
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
            Tenant isolation via PostgreSQL row-level security, multi-factor authentication,
            encryption in transit and at rest, and a full audit-log trail — security posture built in
            from the start, not bolted on later. HarborIQ holds no third-party security
            certification today and doesn&apos;t claim one.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-8 border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="/security">
              Read the security overview <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* -------------------------------------------------------- Pricing / pilot */}
      <section id="pricing-preview" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground">
              Early-access pricing, in the open
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Draft early-access pricing, subject to change. No published rate card yet — pilot
              operators help set it.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`h-full ${tier.highlighted ? "border-amber-500/60 shadow-md" : ""}`}
                data-testid={`card-home-plan-${tier.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
                    {tier.highlighted && (
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                        Most fitting
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-foreground">
                    {tier.monthly === null ? "Custom" : `$${tier.monthly}`}
                    {tier.monthly !== null && (
                      <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>
                    )}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{tier.positioning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              data-testid="button-home-pricing"
              onClick={() => track("pricing_view", { location: "home_pricing_preview" })}
            >
              <Link href="/pricing">
                Compare plans in detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              data-testid="button-home-pilot"
              onClick={() => track("pilot_cta_click", { location: "home_pricing_preview" })}
            >
              <Link href="/demo">Apply for an early-access pilot</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section id="home-faq" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold text-foreground">
            The questions operators actually ask
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {homeFaqs.map((item, i) => (
              <AccordionItem key={item.q} value={`home-faq-${i}`}>
                <AccordionTrigger data-testid={`accordion-home-faq-${i}`} className="text-left text-sm">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8">
            <Button asChild variant="outline" data-testid="button-home-all-faq">
              <Link href="/resources/faq">
                Read the full FAQ <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold text-foreground">
            See HarborIQ running your business, not a slide deck.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Tell us how your operation runs and we&apos;ll walk you through the platform on your own
            workflows. Early-access pilot spots are limited and run by the founder directly.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8"
            data-testid="button-final-cta-demo"
            onClick={() => track("demo_cta_click", { location: "home_final_cta" })}
          >
            <Link href="/demo">
              Get a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Or reach Cory directly:{" "}
            <a
              href="mailto:Cory@HarborIQ.com"
              className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
              data-testid="link-home-email"
              onClick={() => track("outbound_contact_click", { method: "email", location: "home_final_cta" })}
            >
              Cory@HarborIQ.com
            </a>{" "}
            ·{" "}
            <a
              href="tel:+19412101663"
              className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
              data-testid="link-home-phone"
              onClick={() => track("outbound_contact_click", { method: "phone", location: "home_final_cta" })}
            >
              941-210-1663
            </a>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function SolutionCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Wrench;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} data-testid={`link-solution-${href}`}>
      <Card className="hover-elevate active-elevate-2 h-full transition-shadow">
        <CardContent className="p-6">
          <Icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
          <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700">
            Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
