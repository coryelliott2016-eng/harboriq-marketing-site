import { usePageMeta } from "@/hooks/use-page-meta";
import { SiteLayout } from "@/components/layout/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, KeyRound, FileClock, Fingerprint, Network } from "lucide-react";
import securityImage from "@/assets/security-hero.jpg";

const pillars = [
  {
    icon: Network,
    title: "Zero Trust Architecture",
    body: "No implicit trust between services or tenants — every request is authenticated and authorized, not assumed safe because it's on the internal network.",
  },
  {
    icon: Fingerprint,
    title: "Tenant Isolation (Row-Level Security)",
    body: "Each business's data is isolated at the database layer using row-level security policies, not just application-layer filtering.",
  },
  {
    icon: KeyRound,
    title: "Multi-Factor Authentication",
    body: "MFA is available to protect account access beyond a single password.",
  },
  {
    icon: Lock,
    title: "Encryption in Transit & at Rest",
    body: "Data is encrypted both while moving between systems and while stored.",
  },
  {
    icon: FileClock,
    title: "Audit Logging",
    body: "An audit-log trail records access and changes for accountability and incident review.",
  },
  {
    icon: ShieldCheck,
    title: "OWASP ASVS Level 3 Standard",
    body: "HarborIQ's security posture is built against the OWASP Application Security Verification Standard at Level 3, the standard's most rigorous tier.",
  },
];

export default function Security() {
  usePageMeta({
    title: "Security & Architecture",
    description: "HarborIQ's security posture: Zero Trust architecture, an OWASP ASVS Level 3 target, PostgreSQL row-level security for tenant isolation, MFA, audit logging, and encryption in transit and at rest.",
    path: "/security",
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-brand-900">
        <img
          src={securityImage}
          alt=""
          aria-hidden="true"
          width={2400}
          height={1350}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/88 to-brand-900/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Security &amp; Compliance</span>
          <h1 className="mt-4 max-w-2xl text-xl font-display font-bold text-white">
            A Zero-Trust security posture, built to OWASP ASVS Level 3
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/75">
            Marine businesses handle customer payment details, vessel information, and operational
            data. HarborIQ's security architecture is designed around defense in depth, least
            privilege, and continuous verification — not a single perimeter wall.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Explicit h2 keeps the heading order h1 → h2 → h3 for screen readers. */}
          <h2 className="text-lg font-display font-bold text-foreground">
            How HarborIQ protects your data
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <Card key={p.title} data-testid={`card-security-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <CardContent className="p-6">
                  <p.icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-display font-bold text-foreground">Standards this posture is built against</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            HarborIQ's security program is designed with reference to established frameworks, including
            the OWASP Top 10, the OWASP Application Security Verification Standard (ASVS), and Zero Trust
            architecture principles for access control and network segmentation.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "OWASP Top 10 — mitigations for the most common web application risks",
              "OWASP ASVS Level 3 — the standard's highest verification tier",
              "Zero Trust — continuous verification, least-privilege access",
              "Role-based access control across tenant boundaries",
              "Secrets management and key rotation practices",
              "Rate limiting on public endpoints",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-foreground rounded-md border border-card-border bg-card p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            This page describes HarborIQ's security architecture and standards it is built against. It is not a
            certification claim; formal audit and certification status is available on request.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
