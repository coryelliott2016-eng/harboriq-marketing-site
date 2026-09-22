import { usePageMeta } from "@/hooks/use-page-meta";
import { SolutionPage } from "@/components/site/solution-page";
import { Anchor, Receipt, MonitorSmartphone, ShieldCheck } from "lucide-react";
import image from "@/assets/feature-marina-slips.jpg";

export default function Marinas() {
  usePageMeta({
    title: "Marina Management Software",
    description: "Slip, mooring, and dry-stack assignments with double-booking prevention, tenant billing through Stripe, and a customer portal — all in one marina system.",
    path: "/solutions/marinas",
  });

  return (
    <SolutionPage
      eyebrow="Solutions · Marinas"
      title="Slip assignments, billing, and tenant communication together"
      intro="Marinas juggle slip availability, tenant billing, and day-to-day communication across dozens or hundreds of berths. HarborIQ keeps slip management and billing in the same system."
      image={image}
      imageAlt="Aerial view of a marina with numbered boat slips in a geometric dock layout"
      source="marinas"
      previewSurfaces={["slips", "billing", "portal", "dashboard"]}
      previewHeading="The screens behind slip assignment and tenant billing"
      painPoints={[
        { title: "Double-booked slips", body: "Two staff members assign the same slip from two different spreadsheets or calendars." },
        { title: "Billing disconnected from occupancy", body: "Slip fees and services get invoiced separately from who's actually docked where." },
        { title: "Tenants calling for basic status", body: "Without self-service visibility, your front desk fields repetitive calls about invoices and job status." },
      ]}
      capabilities={[
        { icon: Anchor, title: "Marina & Slip Management", body: "Slip assignment and availability tracking with double-booking prevention built in." },
        { icon: Receipt, title: "Invoicing & Stripe", body: "Bill slip fees and service work through the same Stripe-based invoicing flow." },
        { icon: MonitorSmartphone, title: "Customer Portal", body: "Tenants see their slip, invoices, and job status without calling the office." },
        { icon: ShieldCheck, title: "Zero-Trust Security", body: "Tenant data is isolated with row-level security and encrypted in transit and at rest." },
      ]}
    />
  );
}
