import { usePageMeta } from "@/hooks/use-page-meta";
import { SolutionPage } from "@/components/site/solution-page";
import { Users, Radar, BarChart3, MonitorSmartphone } from "lucide-react";
import image from "@/assets/solutions-boatyard.jpg";

export default function Boatyards() {
  usePageMeta({
    title: "Boatyard Management Platform",
    description: "Track haul-outs, storage, and multi-technician jobs in one board. HarborIQ gives boatyards scheduling, job costing, invoicing, and a customer portal.",
    path: "/solutions/boatyards",
  });

  return (
    <SolutionPage
      eyebrow="Solutions · Boatyards"
      title="Coordinate haul-outs, storage, and multi-tech jobs from one board"
      intro="Boatyard work involves more moving parts than a single tech can track: haul-out schedules, storage assignments, and jobs handed between crew. HarborIQ keeps it all visible."
      image={image}
      imageAlt="A boatyard at golden hour with sailboats and motor yachts on jack stands for maintenance"
      source="boatyards"
      previewSurfaces={["dispatch", "work-order", "dashboard", "maintenance"]}
      previewHeading="The screens that keep a multi-tech yard straight"
      painPoints={[
        { title: "Jobs handed off blind", body: "When a job moves between technicians, context and history often don't move with it." },
        { title: "Storage & haul-out chaos", body: "Tracking which vessel is where, and for how long, becomes a manual, error-prone process." },
        { title: "Reporting after the fact", body: "Owners want revenue and utilization numbers your spreadsheets weren't built to produce quickly." },
      ]}
      capabilities={[
        { icon: Users, title: "CRM & Jobs", body: "A shared job record means any tech can pick up where another left off, with full history intact." },
        { icon: Radar, title: "Smart Dispatch", body: "Explainable job scoring helps assign work across your team based on certification fit, workload, and availability." },
        { icon: MonitorSmartphone, title: "Customer Portal", body: "Boat owners can check job status and invoices themselves, cutting down status-check calls." },
        { icon: BarChart3, title: "Accounting & Reporting", body: "Export accounting and reporting data for owners and bookkeeping without manual reconciliation." },
      ]}
    />
  );
}
