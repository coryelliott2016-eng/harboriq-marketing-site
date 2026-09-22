import { Link } from "wouter";
import { usePageMeta } from "@/hooks/use-page-meta";
import { LegalPage } from "@/components/site/legal-page";

export default function Cookies() {
  usePageMeta({
    title: "Cookie Policy",
    description:
      "HarborIQ's marketing website sets no advertising or analytics cookies and stores nothing in your browser. This policy explains exactly what is and is not used.",
    path: "/cookies",
  });

  return (
    <LegalPage
      eyebrow="Legal · Cookies"
      title="Cookie Policy"
      path="/cookies"
      intro="Short version: this website sets no advertising cookies, no analytics cookies, and no third-party trackers, and it stores nothing in your browser to identify you."
      sections={[
        {
          id: "what-we-use",
          heading: "1. What this website uses",
          body: (
            <>
              <p>
                harboriq.com is a static front end with a small API for demo requests and the
                assistant. It does not set tracking cookies, does not embed advertising pixels, and
                does not write to <code>localStorage</code>, <code>sessionStorage</code>, or
                <code> IndexedDB</code> to identify you.
              </p>
              <ul className="flex list-disc flex-col gap-2">
                <li>
                  <strong>Advertising cookies:</strong> none.
                </li>
                <li>
                  <strong>Third-party analytics cookies:</strong> none. No Google Analytics, no
                  Facebook Pixel, no ad-network tags.
                </li>
                <li>
                  <strong>Social media trackers:</strong> none.
                </li>
                <li>
                  <strong>Cross-site identifiers:</strong> none.
                </li>
              </ul>
              <p>
                Because nothing on this page requires consent under the ePrivacy Directive or
                comparable state law, you will not see a cookie banner here. If that changes, the
                banner will appear before the tracking does — not after.
              </p>
            </>
          ),
        },
        {
          id: "measurement",
          heading: "2. How we measure interest without tracking you",
          body: (
            <>
              <p>
                We do want to know which parts of the site are useful — for example whether visitors
                open the product preview or reach the pricing section. HarborIQ does this with an
                in-memory event layer that exists only for the life of the browser tab. Events such as
                &ldquo;a demo button was clicked&rdquo; are held in page memory and are discarded when
                you close or reload the tab.
              </p>
              <p>
                No analytics vendor is connected today, no identifier is generated for you, nothing is
                written to your device, and no event is tied to an individual. Standard web server
                request logs (IP address, timestamp, requested path, user agent) are kept for security
                and abuse prevention, as with any website.
              </p>
            </>
          ),
        },
        {
          id: "essential",
          heading: "3. Strictly necessary technology",
          body: (
            <>
              <p>
                Two things are functionally required and are not used for tracking:
              </p>
              <ul className="flex list-disc flex-col gap-2">
                <li>
                  <strong>Fonts.</strong> Typefaces are loaded from Fontshare&apos;s content delivery
                  network so text renders correctly.
                </li>
                <li>
                  <strong>Security controls.</strong> Rate limiting on the demo and assistant
                  endpoints uses your IP address transiently to stop abuse.
                </li>
              </ul>
              <p>
                If you become a HarborIQ platform customer, the application itself uses a strictly
                necessary session mechanism to keep you signed in. That is a security requirement of
                logging in, not advertising, and it is described in the{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </>
          ),
        },
        {
          id: "your-controls",
          heading: "4. Your controls",
          body: (
            <p>
              You can block or clear cookies and site data at any time in your browser settings, and
              this website will continue to work normally because it does not depend on them. Global
              Privacy Control and Do Not Track signals are respected by default — there is no
              behavioral tracking here to turn off.
            </p>
          ),
        },
        {
          id: "changes",
          heading: "5. Changes to this policy",
          body: (
            <p>
              If HarborIQ later adopts a privacy-respecting analytics provider or any technology that
              stores data on your device, this page will be updated before that technology is
              enabled, the effective date at the top will change, and consent will be requested where
              the law requires it.
            </p>
          ),
        },
      ]}
    />
  );
}
