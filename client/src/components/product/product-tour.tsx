import { useState } from "react";
import {
  Anchor,
  ClipboardList,
  Gauge,
  Radar,
  Receipt,
  Smartphone,
  TrendingUp,
  UserSquare2,
} from "lucide-react";
import { track } from "@/lib/analytics";
import {
  DispatchBoardPreview,
  MaintenanceIntelligencePreview,
  OperationsDashboardPreview,
} from "./mockups-operations";
import {
  EstimateToInvoicePreview,
  SlipManagementPreview,
  WorkOrderPreview,
} from "./mockups-workflow";
import { CustomerPortalPreview, TechnicianMobilePreview } from "./mockups-mobile";

export interface TourSurface {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** The operator problem this screen solves, in the customer's words. */
  headline: string;
  body: string;
  render: () => JSX.Element;
}

export const TOUR_SURFACES: TourSurface[] = [
  {
    id: "dashboard",
    label: "Operations",
    icon: Gauge,
    headline: "Open one screen and know where the day stands",
    body: "Scheduled jobs, technician status, estimates waiting on approval, and cash collected — instead of a whiteboard, three group texts, and a spreadsheet.",
    render: () => <OperationsDashboardPreview />,
  },
  {
    id: "dispatch",
    label: "Dispatch",
    icon: Radar,
    headline: "Assign the right tech without re-planning the whole day",
    body: "A board you can drag, with AI scoring that weighs certification, parts on the truck, urgency, and drive time. The dispatcher decides; the score just does the arithmetic.",
    render: () => <DispatchBoardPreview />,
  },
  {
    id: "work-order",
    label: "Work orders",
    icon: ClipboardList,
    headline: "One record from first call to final photo",
    body: "Vessel details, labor, parts, field photos, and the approval trail live on the same work order — so nothing gets re-typed and nothing gets lost between the dock and the office.",
    render: () => <WorkOrderPreview />,
  },
  {
    id: "billing",
    label: "Estimates & invoices",
    icon: Receipt,
    headline: "Get approved, invoiced, and paid the same day",
    body: "Approved estimates convert into invoices without re-entry, and cards are processed by Stripe. HarborIQ never stores card numbers.",
    render: () => <EstimateToInvoicePreview />,
  },
  {
    id: "field",
    label: "Field app",
    icon: Smartphone,
    headline: "Works in the engine room with no signal",
    body: "Checklists, photos, parts, time, and signatures are captured on-device and sync when the phone finds a tower. Marine work happens where coverage does not.",
    render: () => <TechnicianMobilePreview />,
  },
  {
    id: "portal",
    label: "Customer portal",
    icon: UserSquare2,
    headline: "Cut the 'any update on my boat?' calls",
    body: "Owners see job status, technician photos, approvals, invoices, and service history themselves — and can pay without a phone call.",
    render: () => <CustomerPortalPreview />,
  },
  {
    id: "slips",
    label: "Slips",
    icon: Anchor,
    headline: "Berths, leases, and slip billing on one map",
    body: "Assignment checks dimensions, power, and date overlap before a slip can be committed, so double-bookings are prevented rather than discovered at the dock.",
    render: () => <SlipManagementPreview />,
  },
  {
    id: "maintenance",
    label: "Maintenance IQ",
    icon: TrendingUp,
    headline: "Turn engine hours into recurring revenue",
    body: "Service intervals derived from logged hours and real service history produce a due-soon queue you can actually bill against.",
    render: () => <MaintenanceIntelligencePreview />,
  },
];

export interface ProductTourProps {
  /** Restrict + order the surfaces shown (defaults to all eight). */
  surfaceIds?: string[];
  /** Analytics context, e.g. "home" or "solutions/boatyards". */
  source: string;
  className?: string;
}

/**
 * Tabbed walkthrough of the HarborIQ interface previews.
 *
 * Implemented as a WAI-ARIA tablist with manual activation and arrow-key
 * support. Every panel is a mockup rendered from React/Tailwind and labelled
 * "Product preview" — none of these are screenshots of customer data.
 */
export function ProductTour({ surfaceIds, source, className = "" }: ProductTourProps) {
  const surfaces = surfaceIds
    ? (surfaceIds
        .map((id) => TOUR_SURFACES.find((s) => s.id === id))
        .filter(Boolean) as TourSurface[])
    : TOUR_SURFACES;

  const [activeId, setActiveId] = useState(surfaces[0]?.id ?? "");
  const active = surfaces.find((s) => s.id === activeId) ?? surfaces[0];

  function select(id: string) {
    if (id === activeId) return;
    setActiveId(id);
    track("product_tour_engagement", { surface: id, source });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const i = surfaces.findIndex((s) => s.id === activeId);
    let target: number | null = null;

    if (e.key === "ArrowRight") target = (i + 1) % surfaces.length;
    else if (e.key === "ArrowLeft") target = (i - 1 + surfaces.length) % surfaces.length;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = surfaces.length - 1;
    if (target === null) return;

    e.preventDefault();
    const next = surfaces[target];
    select(next.id);
    document.getElementById(`tour-tab-${next.id}`)?.focus();
  }

  if (!active) return null;

  return (
    <div className={className} data-testid="product-tour">
      <div
        role="tablist"
        aria-label="HarborIQ product preview surfaces"
        onKeyDown={onKeyDown}
        className="-mx-4 flex snap-x gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {surfaces.map((s) => {
          const selected = s.id === activeId;
          return (
            <button
              key={s.id}
              id={`tour-tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`tour-panel-${s.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(s.id)}
              data-testid={`button-tour-${s.id}`}
              className={`flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors ${
                selected
                  ? "border-amber-400/50 bg-amber-400/15 text-amber-100"
                  : "border-white/12 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white/85"
              }`}
            >
              <s.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`tour-panel-${active.id}`}
        aria-labelledby={`tour-tab-${active.id}`}
        tabIndex={0}
        className="mt-5 focus:outline-none"
      >
        <div className="mb-4 max-w-2xl">
          <h3
            className="font-display text-xl font-bold tracking-tight text-white"
            data-testid={`text-tour-headline-${active.id}`}
          >
            {active.headline}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{active.body}</p>
        </div>
        {active.render()}
      </div>
    </div>
  );
}

/** Convenience export for pages that want a single named surface inline. */
export const PRODUCT_PREVIEWS = {
  dashboard: OperationsDashboardPreview,
  dispatch: DispatchBoardPreview,
  workOrder: WorkOrderPreview,
  billing: EstimateToInvoicePreview,
  field: TechnicianMobilePreview,
  portal: CustomerPortalPreview,
  slips: SlipManagementPreview,
  maintenance: MaintenanceIntelligencePreview,
} as const;
