export interface ReleasePhase {
  phase: number;
  title: string;
  summary: string;
}

// Plain-English summary of the 17 build phases referenced in the PRD.
export const releasePhases: ReleasePhase[] = [
  { phase: 1, title: "Foundation & Auth", summary: "Core application scaffolding, authentication, and account setup." },
  { phase: 2, title: "Multi-Tenancy", summary: "Tenant isolation so each business's data stays separated and secure." },
  { phase: 3, title: "Customer CRM", summary: "Customer and vessel profiles with service history tracking." },
  { phase: 4, title: "Job Management", summary: "Job creation, statuses, and lifecycle tracking from intake to completion." },
  { phase: 5, title: "Scheduling", summary: "Calendar-based scheduling for technicians and jobs." },
  { phase: 6, title: "Dispatch Scoring", summary: "Rule-based, explainable scoring (urgency, revenue, distance, parts, technician fit) to help prioritize and assign jobs." },
  { phase: 7, title: "Invoicing", summary: "Invoice generation tied to completed jobs." },
  { phase: 8, title: "Stripe Payments", summary: "Payment collection, Stripe Connect, and refund handling." },
  { phase: 9, title: "Marina & Slip Management", summary: "Slip assignment and availability tracking with double-booking prevention." },
  { phase: 10, title: "Offline Field App (PWA)", summary: "Installable progressive web app that works without a network connection." },
  { phase: 11, title: "Customer Portal", summary: "Self-service portal for customers to view job status and invoices." },
  { phase: 12, title: "Accounting & Reporting", summary: "Reporting views and exports to support bookkeeping." },
  { phase: 13, title: "Role-Based Access Control", summary: "Granular permissions across roles within a tenant." },
  { phase: 14, title: "Audit Logging", summary: "An audit trail recording access and changes for accountability." },
  { phase: 15, title: "Zero-Trust Hardening", summary: "Security hardening aligned to Zero Trust and OWASP ASVS Level 3." },
  { phase: 16, title: "Observability", summary: "Logging, metrics, and monitoring across the platform." },
  { phase: 17, title: "Marketing & Lead Capture", summary: "The public marketing site and lead-capture API you're looking at right now." },
];
