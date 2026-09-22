import { Link } from "wouter";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useBreadcrumbs, useStructuredData } from "@/hooks/use-structured-data";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is HarborIQ built for my type of marine business?",
    a: "HarborIQ is built for three audiences: mobile marine mechanics, boatyards, and marinas. It's the same core product — CRM, dispatch, invoicing — framed for how each type of business actually operates. See the Solutions pages for details on each.",
  },
  {
    q: "Does the field app really work offline?",
    a: "Yes. The field app is an installable progressive web app (PWA) designed to keep working without a network connection and sync automatically once connectivity returns — built specifically for marinas and remote job sites with poor cell coverage.",
  },
  {
    q: "How does invoicing and payment work?",
    a: "Invoicing is built on Stripe, including support for Stripe Connect and refunds, so you can collect payment without a separate billing tool.",
  },
  {
    q: "How does HarborIQ prevent slip double-booking?",
    a: "Marina and slip management includes availability tracking with double-booking prevention built into the assignment flow, rather than relying on a shared spreadsheet or calendar.",
  },
  {
    q: "What security standard is HarborIQ built to?",
    a: "HarborIQ's architecture is built around Zero Trust principles and the OWASP Application Security Verification Standard (ASVS) at Level 3, including tenant isolation via row-level security, MFA, and encryption in transit and at rest. See the Security & Compliance page for the full breakdown.",
  },
  {
    q: "What does the customer portal let my customers do?",
    a: "Customers can view job status and invoices themselves through a self-service portal, reducing the number of status-check calls your team fields.",
  },
  {
    q: "Is pricing final?",
    a: "No — pricing shown on the Pricing page is a proposed starting framework pending final sign-off, not a published rate card.",
  },
  {
    q: "Is HarborIQ live? Do you have customers I can talk to?",
    a: "Not yet. The platform is built and internally tested — 17 development phases complete with 824 automated tests — and early-access pilots are opening now. HarborIQ is pre-pilot, so there are no customers, case studies, testimonials, or uptime statistics to share, and we won't invent them. The founder's own marine service business, Off the Hook Marine Specialist, is the proving ground for the workflows, not a customer reference.",
  },
  {
    q: "Are the product screenshots on this site real?",
    a: "They are real renderings of HarborIQ's interfaces, populated with sample data, and each one is labeled \"Product preview.\" They are not screenshots of a customer's live account — because there isn't one yet.",
  },
  {
    q: "Can I bring my existing customer and vessel data over?",
    a: "Yes. Pilot onboarding includes importing customers, vessels, and open jobs from spreadsheets or your current tool, then configuring roles, rates, checklists, and slip inventory with your team. Onboarding is run by the founder directly during early access.",
  },
  {
    q: "How do you handle my card and my customers' payments?",
    a: "Payments, subscription billing, and payouts run on Stripe, including Stripe Connect and refunds. Card numbers are entered into Stripe and processed by Stripe — HarborIQ never stores them.",
  },
  {
    q: "Does this site track me?",
    a: "No. There are no advertising cookies, no third-party analytics cookies, and nothing is stored in your browser to identify you. See the Cookie Policy in the footer for the specifics.",
  },
  {
    q: "How do I see leads that come in from this site?",
    a: "The unlisted Team Dashboard (linked in the footer as \"Team login\") is gated by an admin token and shows every lead submitted through this site, with breakdowns and CSV export.",
  },
];

export default function FAQ() {
  usePageMeta({
    title: "FAQ",
    description: "Answers to the questions evaluators ask most about HarborIQ: who it's for, what ships today, how security works, pricing, and data migration.",
    path: "/resources/faq",
  });

  useBreadcrumbs("faq", [
    { name: "Resources", path: "/resources/faq" },
    { name: "FAQ", path: "/resources/faq" },
  ]);

  // FAQPage structured data — mirrors exactly what is rendered below, so the
  // markup never claims an answer a visitor cannot read on the page.
  useStructuredData("faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });

  return (
    <SiteLayout>
      <section className="on-dark bg-brand-900 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Resources · FAQ</span>
          <h1 className="mt-4 text-xl font-display font-bold text-white">Frequently asked questions</h1>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`accordion-faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 rounded-lg border border-card-border bg-muted/40 p-6">
            <h2 className="font-display text-lg font-bold text-foreground">
              Still have a question?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask the assistant in the corner of any page, or get a walkthrough on your own workflows.
              You can also email Cory directly at{" "}
              <a
                href="mailto:Cory@HarborIQ.com"
                className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                data-testid="link-faq-email"
              >
                Cory@HarborIQ.com
              </a>
              .
            </p>
            <Button asChild className="mt-5" data-testid="button-faq-demo">
              <Link href="/demo">
                Get a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
