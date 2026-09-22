import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { LegalPage } from "@/components/site/legal-page";

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy",
    description:
      "How HarborIQ collects, uses, and protects information submitted through harboriq.com and the HarborIQ platform, including lead data, AI assistant conversations, and Stripe payment processing.",
    path: "/privacy",
  });

  return (
    <LegalPage
      eyebrow="Legal · Privacy"
      title="Privacy Policy"
      path="/privacy"
      intro="What we collect, why we collect it, and what we do not do with it. HarborIQ is pre-launch, so this policy describes a small, deliberately narrow set of data practices."
      sections={[
        {
          id: "who-we-are",
          heading: "1. Who we are",
          body: (
            <>
              <p>
                HarborIQ, Inc. (&ldquo;HarborIQ,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is a
                Florida corporation based in Sarasota, Florida. We build marine-service management
                software. This policy covers this marketing website (harboriq.com) and the HarborIQ
                platform when you use it as an early-access pilot participant.
              </p>
              <p>
                HarborIQ is currently pre-pilot: we have no live customer base, and the volume of
                personal information we hold is limited to inbound inquiries and pilot onboarding.
              </p>
            </>
          ),
        },
        {
          id: "what-we-collect",
          heading: "2. Information we collect",
          body: (
            <>
              <p>
                <strong>Information you give us on this website.</strong> When you request a demo,
                apply for a pilot, request the investor materials, or use the &ldquo;Ask
                HarborIQ&rdquo; assistant, we store what you type: typically your name, business
                name, email address, phone number, business type, team size, preferred contact
                method, and the message or question you send. We also record which page or form the
                inquiry came from so we know how to follow up.
              </p>
              <p>
                <strong>Assistant conversations.</strong> Messages you send to the AI assistant are
                processed to generate a reply and may be retained as a lead record so we can answer
                unresolved questions. Do not send confidential vessel, financial, or personal health
                information to the assistant.
              </p>
              <p>
                <strong>Platform data (pilot participants).</strong> If you use the HarborIQ
                platform, the operational records you enter — customers, vessels, work orders,
                estimates, invoices, photos, technician activity — are your business data. We process
                it to provide the service to you, not to build a product for someone else.
              </p>
              <p>
                <strong>What we do not collect on this website.</strong> No advertising or analytics
                cookies, no third-party tracking pixels, no cross-site advertising identifiers, and
                no browser storage of your identity. See the{" "}
                <Link href="/cookies">Cookie Policy</Link> for details.
              </p>
            </>
          ),
        },
        {
          id: "how-we-use",
          heading: "3. How we use information",
          body: (
            <>
              <ul className="flex list-disc flex-col gap-2">
                <li>To respond to your demo request, pilot application, or investor inquiry.</li>
                <li>To operate, secure, support, and improve the HarborIQ platform.</li>
                <li>To send transactional messages such as estimate approvals and invoice notices on your behalf, when you are using the platform.</li>
                <li>To meet legal, tax, and accounting obligations.</li>
              </ul>
              <p>
                We do not sell personal information, and we do not share it with data brokers or
                advertising networks. We do not use your platform business data to train
                general-purpose AI models.
              </p>
            </>
          ),
        },
        {
          id: "service-providers",
          heading: "4. Service providers",
          body: (
            <>
              <p>
                We use a small number of vendors to run the business, each with access limited to
                what their function requires:
              </p>
              <ul className="flex list-disc flex-col gap-2">
                <li>
                  <strong>Stripe</strong> — payment processing, subscription billing, and payouts.
                  Card details are entered into Stripe and processed by Stripe. HarborIQ never
                  stores card numbers. See Stripe&apos;s own privacy notice at{" "}
                  <a href="https://stripe.com/privacy" rel="noopener noreferrer" target="_blank">
                    stripe.com/privacy
                  </a>
                  .
                </li>
                <li>
                  <strong>Cloud hosting and managed database providers</strong> — to run the
                  application and store data.
                </li>
                <li>
                  <strong>An AI model provider</strong> — to generate replies in the
                  &ldquo;Ask HarborIQ&rdquo; assistant and to power in-product AI features.
                </li>
                <li>
                  <strong>Email and SMS delivery providers</strong> — to deliver notifications you
                  or your customers have asked for.
                </li>
              </ul>
              <p>
                We will also disclose information if we are legally required to, or where necessary
                to investigate abuse, fraud, or a security incident.
              </p>
            </>
          ),
        },
        {
          id: "security",
          heading: "5. How we protect it",
          body: (
            <>
              <p>
                HarborIQ is engineered to a Zero-Trust architecture and to the OWASP Application
                Security Verification Standard at Level 3, including tenant isolation enforced by
                PostgreSQL row-level security, multi-factor authentication, role-based access
                control, encryption in transit and at rest, secrets management, rate limiting, and
                audit logging.
              </p>
              <p>
                <strong>What we are not claiming:</strong> HarborIQ does not currently hold a SOC 2,
                ISO 27001, PCI DSS, or HIPAA certification or attestation, and has not completed a
                third-party penetration test. We describe the standard we build to, not a
                certification we have not earned. No system is perfectly secure.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          heading: "6. Retention",
          body: (
            <p>
              Website inquiries are retained while we are in contact with you and for a reasonable
              period afterward for business-record purposes, then deleted or anonymized. Platform
              data is retained for as long as your account is active and for a limited period after
              termination so you can export it, after which it is deleted per your agreement with
              us. You can ask us to delete an inquiry at any time.
            </p>
          ),
        },
        {
          id: "your-rights",
          heading: "7. Your choices and rights",
          body: (
            <>
              <p>
                You can ask us to access, correct, export, or delete the information you have given
                us, and you can opt out of non-transactional email at any time. Email{" "}
                <a href="mailto:Cory@HarborIQ.com">Cory@HarborIQ.com</a> and we will respond
                directly — there is no ticket queue between you and the founder.
              </p>
              <p>
                Residents of certain states and countries (for example under the Florida Digital Bill
                of Rights, the CCPA/CPRA, or the GDPR) have additional statutory rights. We honor
                those requests regardless of where you live rather than asking you to prove
                residency. If you are in the EEA or UK and are unsatisfied with our response, you may
                contact your local supervisory authority.
              </p>
            </>
          ),
        },
        {
          id: "children",
          heading: "8. Children",
          body: (
            <p>
              HarborIQ is business software and is not directed to children under 13. We do not
              knowingly collect personal information from children. If you believe a child has
              submitted information to us, email us and we will delete it.
            </p>
          ),
        },
        {
          id: "changes",
          heading: "9. Changes to this policy",
          body: (
            <p>
              We will update this policy as the product moves from pre-pilot to general availability
              — particularly the vendor list and the retention terms. Material changes will be
              reflected in the effective date at the top of this page, and pilot participants will be
              notified by email.
            </p>
          ),
        },
      ]}
    />
  );
}
