import {
  Users,
  Radar,
  Receipt,
  Anchor,
  WifiOff,
  MonitorSmartphone,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export interface FeaturePillar {
  id: string;
  icon: typeof Users;
  title: string;
  summary: string;
  details: string[];
}

// Every claim below maps to a real shipped capability per the HarborIQ PRD —
// no invented metrics, integrations, or capabilities.
export const featurePillars: FeaturePillar[] = [
  {
    id: "crm",
    icon: Users,
    title: "CRM & Jobs",
    summary: "One record per customer and vessel, with full job history attached.",
    details: [
      "Customer and vessel profiles with service history",
      "Job tracking from intake to completion",
      "Notes, attachments, and internal tags per customer",
    ],
  },
  {
    id: "dispatch",
    icon: Radar,
    title: "AI Dispatch",
    summary: "Job scoring that helps you assign the right tech to the right job.",
    details: [
      "AI-assisted job scoring for dispatch prioritization",
      "Technician assignment based on job fit",
      "Fewer missed jobs and reduced no-shows",
    ],
  },
  {
    id: "invoicing",
    icon: Receipt,
    title: "Invoicing & Stripe",
    summary: "Get paid without leaving the dock.",
    details: [
      "Invoicing built on Stripe for payments",
      "Support for Stripe Connect and refunds",
      "Faster collection with fewer manual follow-ups",
    ],
  },
  {
    id: "marina",
    icon: Anchor,
    title: "Marina & Slip Management",
    summary: "Slip assignments without the spreadsheet or the double-booking.",
    details: [
      "Slip assignment and availability tracking",
      "Double-booking prevention for marina slips",
      "Tenant and vessel information tied to each slip",
    ],
  },
  {
    id: "offline-app",
    icon: WifiOff,
    title: "Offline Field App (PWA)",
    summary: "Full functionality at the dock, even with no signal.",
    details: [
      "Installable progressive web app for field technicians",
      "Works offline and syncs when connectivity returns",
      "Built for marinas and boatyards with poor cell coverage",
    ],
  },
  {
    id: "portal",
    icon: MonitorSmartphone,
    title: "Customer Portal",
    summary: "Customers see job status and invoices without a phone call.",
    details: [
      "Self-service portal for job status and invoices",
      "Reduces status-check calls to your team",
      "Consistent, always-on visibility for boat owners",
    ],
  },
  {
    id: "accounting",
    icon: BarChart3,
    title: "Accounting & Reporting",
    summary: "The numbers your books need, exportable when you need them.",
    details: [
      "Accounting and reporting exports",
      "Revenue and job-level reporting",
      "Built to support bookkeeping workflows",
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Zero-Trust Security",
    summary: "Built to an OWASP ASVS Level 3 security standard from day one.",
    details: [
      "Zero Trust architecture with tenant isolation (RLS)",
      "Multi-factor authentication (MFA)",
      "Encryption in transit and at rest, with an audit-log trail",
    ],
  },
];
