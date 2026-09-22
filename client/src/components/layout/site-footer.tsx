import { Link } from "wouter";
import { Logo } from "@/components/site/logo";
import { footerLinks } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="on-dark border-t border-white/10 bg-brand-950 text-white/70" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo className="[&_span]:text-white" />
            <p className="mt-4 max-w-xs text-sm text-white/50">
              The marine-service operating system for mobile mechanics, boatyards, and marinas —
              CRM, AI dispatch, invoicing, and slip management in one place.
            </p>
          </div>

          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn
            title="Solutions"
            links={footerLinks.solutions.map((s) => ({ label: s.label, href: s.href }))}
          />
          <FooterColumn title="Resources" links={footerLinks.resources} />
          <FooterColumn title="Company" links={footerLinks.company} />
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pb-16 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} HarborIQ, Inc. · Sarasota, Florida. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center hover:text-white"
                  data-testid={`link-footer-legal-${link.href.replace("/", "")}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/team"
                className="inline-flex min-h-11 items-center hover:text-white"
                data-testid="link-footer-team-login"
              >
                Team login
              </Link>
            </nav>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-white/60">
            HarborIQ is in pre-pilot early access. Plan pricing shown on this site is draft
            early-access pricing and is subject to change. Interface images labeled &ldquo;Product
            preview&rdquo; are rendered with sample data, not customer accounts. Card payments are
            processed by Stripe; HarborIQ never stores card numbers.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60">{title}</h3>
      <ul className="mt-2 flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            {/* min-h-11 keeps every footer link a 44px touch target (WCAG 2.5.8). */}
            <Link
              href={link.href}
              className="flex min-h-11 items-center text-sm text-white/70 hover:text-white"
              data-testid={`link-footer-${link.href}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
