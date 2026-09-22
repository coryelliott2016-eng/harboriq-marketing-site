import { useEffect } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { track } from "@/lib/analytics";
import founderPortrait from "@/assets/founder-portrait.jpg";
import { SiteLayout } from "@/components/layout/site-layout";
import { LeadForm } from "@/components/site/lead-form";
import { LogoLockup, LogoTile } from "@/components/site/logo";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Anchor,
  BadgeCheck,
  CircleDollarSign,
  Clock,
  CreditCard,
  FileText,
  Gauge,
  Mail,
  MapPin,
  Phone,
  Scale,
  Ship,
  TrendingUp,
  Wrench,
} from "lucide-react";

const marketStats: { value: string; label: string }[] = [
  { value: "$230B/yr", label: "US recreational boating economic impact" },
  { value: "36,000+", label: "Businesses in the sector" },
  { value: "812,000+", label: "Jobs supported" },
  { value: "$55.6B", label: "US recreational marine retail spend (2024)" },
];

const sizingNotes: {
  figure: string;
  confidence: string;
  tone: "authoritative" | "estimate" | "competitor";
  body: string;
}[] = [
  {
    figure: "$230B",
    confidence: "Authoritative",
    tone: "authoritative",
    body:
      "Demand-side backdrop for the industry — not a software TAM. It sizes the economy our customers operate in, not the money available for software.",
  },
  {
    figure: "$50M–$300M",
    confidence: "Founder estimate — not market research",
    tone: "estimate",
    body:
      "US SAM, built bottom-up: roughly 25,000–30,000 target businesses × $2,000–$20,000/yr ACV. Treat the range as a hypothesis to be tested with pilots, not a researched number.",
  },
  {
    figure: "$57B",
    confidence: "Competitor-stated",
    tone: "competitor",
    body:
      "The \"marina economy\" TAM as stated by Dockwa. Cited here only as a signal of investor appetite for the category — not as an independently verified figure.",
  },
];

const problemPoints: { icon: typeof Ship; title: string; body: string }[] = [
  {
    icon: FileText,
    title: "The work still runs on paper",
    body:
      "Marine service businesses run on paper, spreadsheets, and 1990s desktop software. Job history lives in notebooks and text threads.",
  },
  {
    icon: Clock,
    title: "The category leader is 40 years old",
    body:
      "Dockmaster, the category leader, is a Windows-desktop-era ERP built 40 years ago and now owned by PE roll-ups. Per-module fee stacking runs $1,200–$2,500/mo for a mid-size marina.",
  },
  {
    icon: Wrench,
    title: "Generic field service doesn't model marine",
    body:
      "Jobber, Housecall Pro, and ServiceTitan have zero marine data modeling — no vessels, no slips, no moorings, no haul-outs.",
  },
];

const productStatus: { label: string; value: string }[] = [
  { label: "Build phases shipped", value: "17 / 17" },
  { label: "Automated tests passing", value: "824" },
  { label: "Backend tests", value: "703" },
  { label: "Frontend tests", value: "121" },
];

const platformCapabilities: string[] = [
  "Multi-tenant PostgreSQL RLS foundation",
  "CRM and work orders",
  "Stripe Connect invoicing, refunds, and dunning",
  "Offline PWA field app",
  "Customer portal",
  "Marina slip / mooring / dry-stack reservations with double-booking prevention",
];

const whyNow: { icon: typeof TrendingUp; title: string; body: string }[] = [
  {
    icon: Clock,
    title: "Incumbent stagnation",
    body:
      "Dockmaster is PE-owned and anchored to a Windows-desktop architecture. The category leader is not going to rewrite itself.",
  },
  {
    icon: TrendingUp,
    title: "Category validated",
    body:
      "Dockwa raised strategic growth capital from PSG in June 2026 to build \"the operating system for the marina economy.\" Someone credible is funding this thesis.",
  },
  {
    icon: CreditCard,
    title: "Vertical SaaS + embedded payments is proven",
    body:
      "ServiceTitan IPO'd at a $6.3–9B valuation in December 2024 on exactly this model — deep vertical software with payments attached.",
  },
];

const founderCredentials: { icon: typeof Anchor; body: string }[] = [
  {
    icon: BadgeCheck,
    body: "ABYC-certified marine service technician (electrical systems & standards)",
  },
  { icon: Wrench, body: "Mobile marine mechanic — Off the Hook Marine Specialist" },
  { icon: Anchor, body: "Prior hands-on experience at Cannons Marina" },
  { icon: Gauge, body: "Full-stack developer — built HarborIQ's backend personally" },
  { icon: Scale, body: "MBA, University of Colorado Leeds School of Business (May 2024)" },
];

const confidenceStyles: Record<string, string> = {
  authoritative: "border-teal-500/40 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300",
  estimate: "border-amber-500/50 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400",
  competitor: "border-border bg-muted text-muted-foreground",
};

/** Smooth-scrolls to an in-page section id without touching the URL hash. */
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Investors() {
  usePageMeta({
    title: "Investors",
    description: "HarborIQ is raising a seed round. Review the market thesis, product status, and architecture, then request investor materials from Cory@HarborIQ.com.",
    path: "/investors",
  });

  useEffect(() => {
    track("investor_page_view", { path: "/investors" });
  }, []);

  return (
    <SiteLayout>
      {/* ---------------- Hero (dark navy — safe surface for the PNG mark) ---------------- */}
      <section className="bg-brand-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">
              Investors
            </span>
            <Badge className="bg-white/10 text-white/80 hover:bg-white/10">Seed Round · August 2026</Badge>
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr,auto] lg:items-start">
            <div>
              <h1 className="max-w-3xl text-xl font-display font-bold leading-snug text-white">
                Built by an operator who has done the work. Engineered to run thousands of shops
                without a rewrite.
              </h1>

              <p className="mt-6 max-w-2xl text-base text-white/70">
                HarborIQ, Inc. — a Florida profit corporation — is raising a seed round. Round
                size, instrument, and terms are shared directly with investors on request.
              </p>
            </div>
            {/* Full lockup PNG — safe here: this section is dark navy. */}
            <LogoLockup className="hidden h-32 w-auto shrink-0 lg:block" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* Buttons, not href="#..." — hash routing would treat the fragment as a route. */}
            <button
              type="button"
              onClick={() => {
                track("investor_cta_click", { target: "request-deck", location: "investors_hero" });
                scrollToId("request-deck");
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-amber-500 px-5 text-sm font-semibold text-brand-950 transition-colors hover:bg-amber-400"
              data-testid="button-hero-request-deck"
            >
              Request the full investor deck
            </button>
            <button
              type="button"
              onClick={() => {
                track("investor_cta_click", { target: "round-terms", location: "investors_hero" });
                scrollToId("round-terms");
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 px-5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              data-testid="button-hero-round-terms"
            >
              How the round works
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- The problem ---------------- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The problem"
            title="Marine service is one of the last trades without real software"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {problemPoints.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-card-border bg-card p-6"
                data-testid={`card-problem-${p.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                <p.icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Market ---------------- */}
      <section id="market" className="scroll-mt-20 bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Market" title="The industry is large. The software line item is not proven yet." />

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {marketStats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-card-border bg-card p-6"
                data-testid={`stat-market-${s.value.replace(/[^a-zA-Z0-9]/g, "")}`}
              >
                <div className="text-xl font-display font-bold text-foreground">{s.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-card-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  An honest note on market sizing
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Each figure below carries its own confidence label. We would rather be corrected on
                  a labelled estimate than believed on an unlabelled one.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-6">
              {sizingNotes.map((n) => (
                <div
                  key={n.figure}
                  className="grid gap-3 border-t border-border pt-6 first:border-0 first:pt-0 sm:grid-cols-[180px,1fr] sm:gap-6"
                  data-testid={`sizing-note-${n.tone}`}
                >
                  <div>
                    <div className="text-lg font-display font-bold text-foreground">{n.figure}</div>
                    <span
                      className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${confidenceStyles[n.tone]}`}
                    >
                      {n.confidence}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Product status ---------------- */}
      <section id="product-status" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Product status"
            title="The platform is already built and tested end to end"
          />

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {productStatus.map((s) => (
              <div key={s.label} className="rounded-lg border border-card-border bg-card p-6" data-testid={`stat-product-${s.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                <div className="text-xl font-display font-bold text-foreground">{s.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            824 automated tests passing — 703 backend plus 121 frontend — executed against a real
            PostgreSQL instance, not mocks.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr,360px] lg:items-start">
            <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
              <h3 className="text-base font-semibold text-foreground">Full platform, shipped</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {platformCapabilities.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-foreground">
                    <Anchor className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-50 p-6 dark:bg-amber-950/20">
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-400">
                Next milestone
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">
                First paying production pilot customer.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                HarborIQ is currently pre-pilot and pre-revenue. We are not going to dress that up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Why now ---------------- */}
      <section className="bg-brand-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Why now</span>
          <h2 className="mt-4 max-w-2xl text-xl font-display font-bold text-white">
            Three forces converging on the same window
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {whyNow.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-white/10 bg-white/5 p-6"
                data-testid={`card-whynow-${f.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                <f.icon className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-white/70">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-white/10 bg-brand-800 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <LogoTile markClassName="h-7 w-auto" className="hidden shrink-0 border border-white/10 sm:inline-flex" />
              <div>
                <h3 className="text-base font-semibold text-white">HarborIQ's wedge</h3>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Dockwa is booking-first. HarborIQ starts where the money and the labor actually
                  are: <strong className="font-semibold text-white">work orders, CRM, and payments</strong>{" "}
                  — the service side.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Business model ---------------- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Business model" title="Flat-tier vertical SaaS with embedded payments" />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
              <CircleDollarSign className="h-6 w-6 text-teal-700" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-foreground">Subscription</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Flat-tier vertical SaaS at roughly <strong className="font-semibold text-foreground">$99–$399/mo</strong>{" "}
                by shop size. Illustrative target pricing, not a published rate card.
              </p>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
              <CreditCard className="h-6 w-6 text-teal-700" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-foreground">Embedded payments</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Payments run through Stripe Connect. Industry benchmark is roughly{" "}
                <strong className="font-semibold text-foreground">$4.2K incremental ARR per customer</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Round terms ---------------- */}
      <section id="round-terms" className="scroll-mt-20 bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The round" title="Round details are shared on request" />

          <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-lg border border-border bg-background p-5 sm:p-6">
            <Scale className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground" data-testid="text-round-details">
              Round size, instrument, valuation terms, and use of funds are provided directly to
              interested investors along with the full deck. Nothing on this page is an offer to
              sell, or a solicitation of an offer to buy, any security. Request materials below.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Founder ---------------- */}
      <section id="founder" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Founder" title="Cory Elliott — Founder & CEO" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,340px] lg:items-start">
            <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
              <p className="text-base text-muted-foreground">
                HarborIQ is built by someone who has been on the boat with the tools in hand and then
                wrote the software himself. Based in Sarasota, Florida.
              </p>
              <p className="mt-4 text-base text-muted-foreground">
                Off the Hook Marine Specialist is the origin and proving ground of the product: the
                workflows shipped in HarborIQ — vessel records, work orders, dispatch, invoicing —
                were shaped daily by real dockside service calls at that shop, not derived from
                market research. That is founder-market fit, not traction: HarborIQ remains pre-pilot
                with zero paying customers, and the platform's design credibility comes from the
                trade knowledge behind it rather than from revenue.
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {founderCredentials.map((c) => (
                  <li key={c.body} className="flex items-start gap-3 text-sm text-foreground">
                    <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                    {c.body}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-brand-900">
              <img
                src={founderPortrait}
                alt="Cory Elliott, founder and CEO of HarborIQ"
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover object-top"
                data-testid="img-investors-founder"
              />
              <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold text-white">Cory Elliott</p>
              <p className="mt-1 text-sm text-white/60">Founder &amp; CEO · Sarasota, FL</p>
              <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm">
                <a href="mailto:Cory@HarborIQ.com" className="flex items-center gap-2 text-white/75 hover:text-white" data-testid="link-founder-email">
                  <Mail className="h-4 w-4 text-amber-400" aria-hidden="true" /> Cory@HarborIQ.com
                </a>
                <a href="tel:+19412101663" className="flex items-center gap-2 text-white/75 hover:text-white" data-testid="link-founder-phone">
                  <Phone className="h-4 w-4 text-amber-400" aria-hidden="true" /> 941-210-1663
                </a>
                <span className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4 text-amber-400" aria-hidden="true" /> Sarasota, FL
                </span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section id="request-deck" className="scroll-mt-20 bg-brand-950 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr,460px] lg:items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                Next step
              </span>
              <h2 className="mt-4 text-xl font-display font-bold text-white">
                Request the full investor deck
              </h2>
              <p className="mt-4 max-w-lg text-base text-white/70">
                The deck covers the full round detail, product architecture, competitive teardown, and
                the pilot plan. We'll send it directly — no data room gate.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm">
                <a href="mailto:Cory@HarborIQ.com" className="flex items-center gap-2 text-white/80 hover:text-white" data-testid="link-cta-email">
                  <Mail className="h-4 w-4 text-amber-400" aria-hidden="true" /> Cory@HarborIQ.com
                </a>
                <a href="tel:+19412101663" className="flex items-center gap-2 text-white/80 hover:text-white" data-testid="link-cta-phone">
                  <Phone className="h-4 w-4 text-amber-400" aria-hidden="true" /> 941-210-1663
                </a>
                <span className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4 text-amber-400" aria-hidden="true" /> Sarasota, FL
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
              <LeadForm
                source="investors_page"
                compact
                defaultTeamSize="enterprise"
                hideTeamSize
                title="Request the deck"
                description="Send your details and we'll follow up with the full investor materials."
                submitLabel="Request the deck"
                businessLabel="Firm or organization"
                businessPlaceholder="Harbor Lane Capital"
                footnote="Investor inquiries only. We'll reach out directly — no mailing list."
              />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">{eyebrow}</span>
      <h2 className="mt-3 text-xl font-display font-bold text-foreground">{title}</h2>
    </div>
  );
}
