import type { ReactNode } from "react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";
import { track } from "@/lib/analytics";
import { Mail, Phone } from "lucide-react";

export const LEGAL_EFFECTIVE_DATE = "August 13, 2026";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

/**
 * Shared shell for /privacy, /terms and /cookies.
 *
 * These are plain-language policies written for a pre-launch Florida SaaS
 * company. They are not legal advice and have not been reviewed by outside
 * counsel — that disclosure is rendered on every legal page on purpose.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  path,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  path: string;
}) {
  return (
    <SiteLayout>
      <section className="on-dark bg-brand-900 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">{eyebrow}</span>
          <h1 className="mt-4 font-display text-xl font-bold text-white">{title}</h1>
          <p className="mt-4 text-base text-white/70">{intro}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/55">
            <div className="flex gap-2">
              <dt className="text-white/60">Effective</dt>
              <dd>{LEGAL_EFFECTIVE_DATE}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-white/60">Applies to</dt>
              <dd>harboriq.com{path === "/privacy" ? " and the HarborIQ platform" : ""}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* On-page contents — buttons, not anchors, because the site uses hash routing. */}
          <nav aria-label="On this page" className="rounded-lg border border-card-border bg-muted/40 p-5">
            <h2 className="text-sm font-semibold text-foreground">On this page</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    data-testid={`button-legal-jump-${s.id}`}
                    onClick={() =>
                      document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="text-left text-sm text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                  >
                    {s.heading}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 flex flex-col gap-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24" data-testid={`section-legal-${s.id}`}>
                <h2 className="font-display text-lg font-bold text-foreground">{s.heading}</h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-teal-700 [&_a]:underline-offset-4 hover:[&_a]:underline dark:[&_a]:text-teal-400 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-lg border border-card-border p-6" id="legal-contact">
            <h2 className="font-display text-lg font-bold text-foreground">Questions about this policy</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              HarborIQ, Inc. is a Florida corporation based in Sarasota, Florida. Reach the founder
              directly:
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                <a
                  href="mailto:Cory@HarborIQ.com"
                  className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                  data-testid="link-legal-email"
                  onClick={() => track("outbound_contact_click", { method: "email", location: `legal_${path}` })}
                >
                  Cory@HarborIQ.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                <a
                  href="tel:+19412101663"
                  className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                  data-testid="link-legal-phone"
                  onClick={() => track("outbound_contact_click", { method: "phone", location: `legal_${path}` })}
                >
                  941-210-1663
                </a>
              </li>
            </ul>
            <p className="mt-5 border-t border-card-border pt-4 text-xs text-muted-foreground">
              <strong className="text-foreground">Plain-language notice:</strong> this document is
              written to describe how HarborIQ actually operates today. It is not legal advice, and it
              has not yet been reviewed by outside counsel. It will be revised before general
              availability and when a pilot agreement is signed, the signed agreement governs.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              See also:{" "}
              <Link href="/privacy" className="underline underline-offset-4" data-testid="link-legal-privacy">
                Privacy Policy
              </Link>{" "}
              ·{" "}
              <Link href="/terms" className="underline underline-offset-4" data-testid="link-legal-terms">
                Terms of Service
              </Link>{" "}
              ·{" "}
              <Link href="/cookies" className="underline underline-offset-4" data-testid="link-legal-cookies">
                Cookie Policy
              </Link>
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
