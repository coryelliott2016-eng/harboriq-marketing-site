import { usePageMeta } from "@/hooks/use-page-meta";
import { SiteLayout } from "@/components/layout/site-layout";
import { DemoForm } from "@/components/site/demo-form";
import { track } from "@/lib/analytics";
import { ShieldCheck, Clock, Users2, Phone, MapPin } from "lucide-react";

export default function Demo() {
  usePageMeta({
    title: "Get a Demo",
    description: "Request a HarborIQ demo or apply for an early-access pilot — dispatch, invoicing, slip management, or the offline field app. A 20–30 minute walkthrough, no commitment. Or contact Cory Elliott directly in Sarasota, Florida.",
    path: "/demo",
  });

  return (
    <SiteLayout>
      <section className="py-16 sm:py-24 pb-28 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr,1fr] lg:items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Get a Demo</span>
              <h1 className="mt-4 text-xl font-display font-bold text-foreground">
                Tell us about your business — we&apos;ll show you the parts that matter to you
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                A short walkthrough focused on your actual workflow: dispatch, invoicing, slip
                management, or the field app — whatever's costing you the most time right now.
              </p>

              <div className="mt-10 flex flex-col gap-5">
                <InfoRow icon={Clock} title="Typically a 20–30 minute call" body="We'll ask a few questions about your current workflow first, then show HarborIQ live." />
                <InfoRow icon={Users2} title="For any team size" body="From a solo mobile mechanic to a multi-slip marina — we tailor the walkthrough to your operation." />
                <InfoRow icon={ShieldCheck} title="No commitment required" body="This is a conversation, not a contract. We'll follow up by email after your request." />
              </div>

              {/* This page doubles as the contact page — some operators would rather just call. */}
              <div className="mt-10 rounded-xl border border-card-border bg-muted/40 p-6" id="contact">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Rather just talk to a person?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Early access is run by the founder directly — no call center, no SDR queue.
                </p>
                <ul className="mt-4 flex flex-col gap-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                    <a
                      href="tel:+19412101663"
                      className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                      data-testid="link-contact-phone"
                      onClick={() => track("outbound_contact_click", { method: "phone", location: "demo_page" })}
                    >
                      941-210-1663
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                    HarborIQ, Inc. · Sarasota, Florida
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
              <DemoForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoRow({ icon: Icon, title, body }: { icon: typeof Clock; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <Icon className="h-5 w-5 shrink-0 text-teal-700 mt-0.5" aria-hidden="true" />
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
