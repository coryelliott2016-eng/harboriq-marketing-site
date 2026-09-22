import { Panel, Pill, PreviewFrame, ProgressTrack, Avatar } from "./preview-frame";
import {
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  CloudOff,
  CreditCard,
  FileText,
  MapPin,
  MessageSquare,
  PenLine,
  Play,
  Ship,
  Timer,
  Wrench,
} from "lucide-react";

/* --------------------------------------------- 7. Technician mobile app */

export function TechnicianMobilePreview() {
  return (
    <PreviewFrame
      title="Technician field app"
      caption="Installable PWA that keeps working with no dock signal, then syncs."
      chrome="mobile"
      testId="preview-technician-mobile"
    >
      <div className="flex min-h-[520px] flex-col text-white">
        {/* Offline banner */}
        <div className="flex items-center gap-2 bg-amber-400/15 px-3 py-2 text-[10px] font-medium text-amber-100">
          <CloudOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Offline — 3 changes queued, will sync automatically
        </div>

        <div className="flex items-center gap-2 px-3 pt-3">
          <Avatar initials="CE" />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold">Cory E.</p>
            <p className="text-[10px] text-white/45">4 jobs today · 2 done</p>
          </div>
          <Pill tone="cyan">On site</Pill>
        </div>

        {/* Active job card */}
        <div className="mx-3 mt-3 rounded-lg border border-teal-400/25 bg-teal-400/[0.07] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white">WO-2417 · Repower survey</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/50">
                <Ship className="h-3 w-3 shrink-0" aria-hidden="true" /> 42′ Pursuit · Whitaker
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/50">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" /> Marina Jack · Slip B-14
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-teal-400/20 px-2 py-1 font-mono text-[10px] text-teal-100">
              <Timer className="h-3 w-3" aria-hidden="true" /> 1:42
            </span>
          </div>
          <div className="mt-2.5">
            <ProgressTrack pct={62} />
            <p className="mt-1 text-[10px] text-white/60">Checklist 5 of 8 complete</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="mx-3 mt-3 flex flex-col gap-1.5">
          {[
            { label: "Verify hull ID & engine hours", done: true },
            { label: "Compression test · all 4 engines", done: true },
            { label: "Photograph cyl 3 leak-down", done: true },
            { label: "Fuel system inspection", done: false },
            { label: "Owner walkthrough & signature", done: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.03] px-2.5 py-2"
            >
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                  item.done ? "border-emerald-400/50 bg-emerald-400/20" : "border-white/20"
                }`}
                aria-hidden="true"
              >
                {item.done && <Check className="h-2.5 w-2.5 text-emerald-300" aria-hidden="true" />}
              </span>
              <span className={`text-[11px] ${item.done ? "text-white/45 line-through" : "text-white/85"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick actions — 44px touch targets */}
        <div className="mx-3 mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: Camera, label: "Photo" },
            { icon: Wrench, label: "Add part" },
            { icon: PenLine, label: "Signature" },
          ].map((a) => (
            <span
              key={a.label}
              className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/[0.04] text-[10px] text-white/70"
            >
              <a.icon className="h-4 w-4 text-teal-300" aria-hidden="true" />
              {a.label}
            </span>
          ))}
        </div>

        <div className="mx-3 mb-3 mt-auto pt-3">
          <span className="flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-amber-500 px-3 text-[11px] font-semibold text-brand-950">
            <Play className="h-3.5 w-3.5" aria-hidden="true" /> Complete job & build estimate
          </span>
          <p className="mt-2 text-center text-[9px] text-white/60">
            Everything above is captured on-device and syncs when signal returns.
          </p>
        </div>
      </div>
    </PreviewFrame>
  );
}

/* ------------------------------------------------- 8. Customer portal */

export function CustomerPortalPreview() {
  return (
    <PreviewFrame
      title="Customer portal"
      caption="What the boat owner sees — status, photos, approvals, and payment, without a phone call."
      testId="preview-customer-portal"
    >
      <div className="min-h-[420px] p-4 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-sm font-bold">Welcome back, Marcus</h3>
            <p className="text-[11px] text-white/45">42′ Pursuit S 408 · Marina Jack, Slip B-14</p>
          </div>
          <Pill tone="cyan">1 job in progress</Pill>
          <span className="ml-auto hidden font-mono text-[10px] text-white/30 sm:inline">Sample account</span>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr,1fr]">
          <Panel title="Current job · WO-2417">
            <ol className="flex flex-col gap-2">
              {[
                { label: "Request received", when: "Jun 4", done: true },
                { label: "Estimate sent · $699.50", when: "Jun 4", done: true },
                { label: "You approved the estimate", when: "Jun 4", done: true },
                { label: "Technician on site", when: "Jun 9", done: true, current: true },
                { label: "Work complete & invoiced", when: "Pending", done: false },
              ].map((s) => (
                <li key={s.label} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                      s.done
                        ? "border-emerald-400/50 bg-emerald-400/20"
                        : "border-white/20 bg-white/[0.03]"
                    }`}
                    aria-hidden="true"
                  >
                    {s.done && <Check className="h-2.5 w-2.5 text-emerald-300" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[11px] ${s.current ? "font-semibold text-teal-200" : "text-white/80"}`}
                    >
                      {s.label}
                    </span>
                    <span className="text-[10px] text-white/60">{s.when}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden="true">
              {["from-teal-500/25", "from-amber-500/20", "from-brand-600/40"].map((g, i) => (
                <span
                  key={i}
                  className={`grid aspect-[4/3] place-items-center rounded bg-gradient-to-br ${g} to-brand-900`}
                >
                  <Camera className="h-3.5 w-3.5 text-white/60" aria-hidden="true" />
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-white/60">
              Technician photos posted from the dock at 9:14 AM
            </p>
          </Panel>

          <div className="flex flex-col gap-3">
            <Panel
              title="Invoices"
              action={<Pill tone="green">Autopay on</Pill>}
            >
              <ul className="flex flex-col gap-2 text-[11px]">
                {[
                  { id: "INV-1108", amt: "$748.47", state: "Due Jun 16", tone: "amber" as const, icon: CreditCard },
                  { id: "INV-1074", amt: "$1,240.00", state: "Paid May 22", tone: "green" as const, icon: CheckCircle2 },
                  { id: "INV-1031", amt: "$396.75", state: "Paid Apr 8", tone: "green" as const, icon: CheckCircle2 },
                ].map((inv) => (
                  <li key={inv.id} className="flex items-center gap-2">
                    <inv.icon className="h-3.5 w-3.5 shrink-0 text-white/60" aria-hidden="true" />
                    <span className="font-mono text-white/70">{inv.id}</span>
                    <span className="ml-auto font-mono text-white/85">{inv.amt}</span>
                    <Pill tone={inv.tone}>{inv.state}</Pill>
                  </li>
                ))}
              </ul>
              <div className="mt-2.5 flex min-h-11 items-center justify-center rounded-md bg-amber-500 text-[11px] font-semibold text-brand-950">
                Pay $748.47 securely
              </div>
              <p className="mt-1.5 text-center text-[9px] text-white/60">
                Card payments processed by Stripe
              </p>
            </Panel>

            <Panel title="Service history & documents">
              <ul className="flex flex-col gap-1.5 text-[11px] text-white/75">
                {[
                  { icon: ClipboardList, t: "200-hour service · May 2026" },
                  { icon: FileText, t: "Repower proposal (PDF)" },
                  { icon: MessageSquare, t: "Message your service advisor" },
                ].map((row) => (
                  <li key={row.t} className="flex items-center gap-2">
                    <row.icon className="h-3.5 w-3.5 shrink-0 text-teal-300" aria-hidden="true" />
                    {row.t}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}
