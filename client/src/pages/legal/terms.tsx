import { Link } from "wouter";
import { usePageMeta } from "@/hooks/use-page-meta";
import { LegalPage } from "@/components/site/legal-page";

export default function Terms() {
  usePageMeta({
    title: "Terms of Service",
    description:
      "The terms that govern use of the HarborIQ website and the HarborIQ early-access platform, including early-access status, draft pricing, acceptable use, your data, and liability.",
    path: "/terms",
  });

  return (
    <LegalPage
      eyebrow="Legal · Terms"
      title="Terms of Service"
      path="/terms"
      intro="These terms cover this website and early-access use of the HarborIQ platform. They are written to be readable, and they say plainly what HarborIQ is and is not today."
      sections={[
        {
          id: "acceptance",
          heading: "1. Agreement to these terms",
          body: (
            <p>
              By using harboriq.com or the HarborIQ platform you agree to these terms. If you do not
              agree, please do not use the site or the platform. If you enter into a separate written
              pilot, subscription, or enterprise agreement with HarborIQ, Inc., that signed agreement
              controls wherever it conflicts with this page.
            </p>
          ),
        },
        {
          id: "early-access",
          heading: "2. Early-access status",
          body: (
            <>
              <p>
                HarborIQ is in early access. The platform has completed 17 internal development
                phases with 824 automated tests, and it is not yet in general availability. There is
                no published service-level agreement, no uptime guarantee, and no third-party
                security certification.
              </p>
              <p>
                Features, interfaces, and plan contents may change during early access. Any interface
                images on this website are labeled &ldquo;Product preview&rdquo; and are rendered with
                sample data — they are illustrations of the software, not screenshots of a customer
                account.
              </p>
            </>
          ),
        },
        {
          id: "accounts",
          heading: "3. Accounts and acceptable use",
          body: (
            <>
              <p>
                You are responsible for your account credentials, for the users you invite, and for
                the accuracy of the business data you enter. You agree not to:
              </p>
              <ul className="flex list-disc flex-col gap-2">
                <li>Attempt to access another tenant&apos;s data, or bypass authentication, tenant isolation, or rate limits.</li>
                <li>Probe, scan, or load-test the platform without written permission.</li>
                <li>Upload malware, or content that is unlawful or that you do not have the right to store.</li>
                <li>Resell, sublicense, or white-label the platform without a written agreement.</li>
                <li>Use the platform to send unsolicited bulk messages to people who have not asked to hear from you.</li>
              </ul>
              <p>
                If you find a security vulnerability, please report it to{" "}
                <a href="mailto:Cory@HarborIQ.com">Cory@HarborIQ.com</a> before disclosing it
                publicly. We will not pursue good-faith security research that respects other
                tenants&apos; data.
              </p>
            </>
          ),
        },
        {
          id: "pricing",
          heading: "4. Pricing, billing, and payments",
          body: (
            <>
              <p>
                Plan pricing shown on this website is <strong>draft early-access pricing and is
                subject to change</strong>. It is not a published rate card and does not constitute an
                offer. Final pricing for a pilot is confirmed in writing before any charge.
              </p>
              <p>
                Subscription billing and card payments are processed by Stripe. HarborIQ never stores
                card numbers. Fees are billed in advance for the applicable period and are
                non-refundable except where required by law or expressly agreed in writing. You are
                responsible for applicable taxes.
              </p>
            </>
          ),
        },
        {
          id: "your-data",
          heading: "5. Your data",
          body: (
            <>
              <p>
                You own the business data you put into HarborIQ. We claim no ownership of your
                customer records, vessel records, work orders, photos, or financial records, and we
                do not use them to train general-purpose AI models. We process them to provide,
                secure, and support the service, as described in the{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
              <p>
                You can export your data while your account is active, and for a limited period after
                termination. During early access you should keep your own backups of anything
                business-critical.
              </p>
            </>
          ),
        },
        {
          id: "ai",
          heading: "6. AI features",
          body: (
            <p>
              HarborIQ includes AI-assisted features such as dispatch scoring, maintenance
              suggestions, and the website assistant. These produce <strong>suggestions, not
              decisions</strong>. They can be wrong, they are not a substitute for a qualified
              technician&apos;s judgment, and they must not be relied on for safety-critical marine
              decisions. A human always makes the final call — dispatch assignments, repair
              recommendations, and billing remain your responsibility.
            </p>
          ),
        },
        {
          id: "ip",
          heading: "7. Intellectual property",
          body: (
            <p>
              The HarborIQ platform, website, name, logo, and documentation are the property of
              HarborIQ, Inc. Early access grants you a limited, non-exclusive, non-transferable right
              to use the platform for your own business operations during the access period. Feedback
              you send us may be used to improve the product without obligation to you, but it will
              never be published as a testimonial or case study without your written permission.
            </p>
          ),
        },
        {
          id: "disclaimer",
          heading: "8. Disclaimers and limitation of liability",
          body: (
            <>
              <p>
                The website and the early-access platform are provided &ldquo;as is&rdquo; and
                &ldquo;as available,&rdquo; without warranties of any kind, express or implied,
                including merchantability, fitness for a particular purpose, and non-infringement. We
                do not warrant uninterrupted or error-free operation during early access.
              </p>
              <p>
                To the maximum extent permitted by law, HarborIQ, Inc. is not liable for indirect,
                incidental, special, consequential, or punitive damages, or for lost profits, lost
                revenue, or lost data. Our total aggregate liability arising out of these terms will
                not exceed the greater of the fees you paid us in the three months before the claim
                or one hundred U.S. dollars.
              </p>
            </>
          ),
        },
        {
          id: "termination",
          heading: "9. Termination",
          body: (
            <p>
              You may stop using the platform at any time. We may suspend or terminate access for
              non-payment, for a violation of these terms, or where continued access would create a
              security or legal risk. On termination we will give you a reasonable window to export
              your data.
            </p>
          ),
        },
        {
          id: "law",
          heading: "10. Governing law",
          body: (
            <p>
              These terms are governed by the laws of the State of Florida, without regard to its
              conflict-of-laws rules. The exclusive venue for any dispute is the state or federal
              courts located in Sarasota County, Florida, and both parties consent to that
              jurisdiction. Nothing here waives any right you cannot waive under applicable law.
            </p>
          ),
        },
        {
          id: "changes",
          heading: "11. Changes",
          body: (
            <p>
              We may update these terms as HarborIQ moves toward general availability. Material
              changes will be reflected in the effective date at the top of this page and, for
              account holders, sent by email. Continued use after an update means you accept the
              revised terms.
            </p>
          ),
        },
      ]}
    />
  );
}
