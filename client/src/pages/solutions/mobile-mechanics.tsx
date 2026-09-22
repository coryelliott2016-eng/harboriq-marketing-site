import { usePageMeta } from "@/hooks/use-page-meta";
import { SolutionPage } from "@/components/site/solution-page";
import { Radar, Receipt, WifiOff, Users } from "lucide-react";
import image from "@/assets/solutions-mobile-mechanic.jpg";

export default function MobileMechanics() {
  usePageMeta({
    title: "Marine Mechanic Software for Mobile Techs",
    description: "Dispatch, invoice, and get paid from the dock or the driveway. HarborIQ gives mobile marine mechanics a CRM, scheduling, Stripe invoicing, and an offline field app.",
    path: "/solutions/mobile-mechanics",
  });

  return (
    <SolutionPage
      eyebrow="Solutions · Mobile Marine Mechanics"
      title="Dispatch, invoice, and get paid — without going back to the shop"
      intro="You're working out of a van, not an office. HarborIQ keeps your jobs, invoices, and customer history with you, whether you've got a signal or not."
      image={image}
      imageAlt="A mobile marine mechanic at a work van with a rugged tablet at sunrise near a harbor"
      source="mobile-mechanics"
      previewSurfaces={["field", "dispatch", "billing", "portal"]}
      previewHeading="The screens you'd live in, van to invoice"
      painPoints={[
        { title: "Jobs tracked in a notebook", body: "Job details, parts used, and follow-ups live in your head or a paper pad that doesn't travel well." },
        { title: "Invoicing after the fact", body: "You invoice from memory that evening, and details — or payment — slip through the cracks." },
        { title: "No signal, no records", body: "Marinas and remote coves often have no cell service, so cloud-only tools go dark exactly when you need them." },
      ]}
      capabilities={[
        { icon: Users, title: "CRM & Jobs", body: "Every customer and vessel's history is one tap away, so you never start a job blind." },
        { icon: Radar, title: "AI Dispatch", body: "AI-assisted job scoring helps you prioritize your route and reduce wasted drive time." },
        { icon: Receipt, title: "Invoicing & Stripe", body: "Generate and send an invoice on-site, with payment collected through Stripe before you leave the dock." },
        { icon: WifiOff, title: "Offline Field App", body: "The installable PWA keeps working with no signal and syncs automatically once you're back in range." },
      ]}
    />
  );
}
