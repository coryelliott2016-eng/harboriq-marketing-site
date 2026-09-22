import {
  AiNote,
  AppShell,
  Metric,
  Panel,
  Pill,
  PreviewFrame,
  ProgressTrack,
  Avatar,
} from "./preview-frame";
import {
  Anchor,
  BarChart3,
  Camera,
  Check,
  ClipboardList,
  CreditCard,
  Gauge,
  PenLine,
  Radar,
  Receipt,
  Ship,
  Users,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: Gauge },
  { label: "Dispatch", icon: Radar },
  { label: "Work orders", icon: ClipboardList },
  { label: "Customers", icon: Users },
  { label: "Slips", icon: Anchor },
  { label: "Invoices", icon: Receipt },
  { label: "Reports", icon: BarChart3 },
];

/* ------------------------------------------------- 4. Work order lifecycle */

export function WorkOrderPreview() {
  const stages = ["Intake", "Estimated", "Approved", "In progress", "QC", "Invoiced"];
  const currentStage = 3;

  return (
    <PreviewFrame
      title="Work order"
      caption="One record from intake to invoice — parts, labor, photos, and approvals attached."
      testId="preview-work-order"
    >
      <AppShell
        nav={NAV}
        active="Work orders"
        header={
          <>
            <h3 className="font-display text-sm font-bold">WO-2417 · Repower survey</h3>
            <Pill tone="cyan">In progress</Pill>
            <span className="ml-auto hidden font-mono text-[10px] text-white/60 sm:inline">
              Opened Jun 4
            </span>
          </>
        }
      >
        {/* Stage rail */}
        <ol className="flex flex-wrap items-center gap-1.5">
          {stages.map((s, i) => (
            <li key={s} className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  i < currentStage
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : i === currentStage
                      ? "border-teal-400/40 bg-teal-400/15 text-teal-100"
                      : "border-white/10 bg-white/[0.02] text-white/60"
                }`}
              >
                {i < currentStage && <Check className="h-2.5 w-2.5" aria-hidden="true" />}
                {s}
              </span>
              {i < stages.length - 1 && (
                <span className="h-px w-3 bg-white/15" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr,0.85fr]">
          <div className="flex flex-col gap-3">
            <Panel title="Vessel & customer">
              <div className="grid gap-2 text-[11px] sm:grid-cols-2">
                {[
                  ["Vessel", "42′ Pursuit S 408 · 2019"],
                  ["Engines", "Quad Yamaha F300 · 1,182 hrs"],
                  ["Owner", "M. Whitaker · Marina Jack B-14"],
                  ["Hull ID", "PUR42S19-0447"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] uppercase tracking-wide text-white/60">{k}</p>
                    <p className="mt-0.5 text-white/85">{v}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Line items">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-white/60">
                    <th className="pb-1.5 font-medium">Item</th>
                    <th className="pb-1.5 font-medium">Qty</th>
                    <th className="pb-1.5 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Diagnostic labor · ABYC tech", "2.5 hr", "$362.50"],
                    ["Compression + leak-down test", "1.0 hr", "$145.00"],
                    ["Fuel filter kit (4)", "4", "$168.00"],
                    ["Shop supplies", "1", "$24.00"],
                  ].map(([item, qty, amt]) => (
                    <tr key={item} className="border-t border-white/8">
                      <td className="py-1.5 pr-2 text-white/80">{item}</td>
                      <td className="py-1.5 pr-2 font-mono text-white/55">{qty}</td>
                      <td className="py-1.5 text-right font-mono text-white/85">{amt}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-white/15">
                    <td className="py-1.5 font-medium text-white/90">Total</td>
                    <td />
                    <td className="py-1.5 text-right font-mono font-semibold text-teal-300">$699.50</td>
                  </tr>
                </tbody>
              </table>
            </Panel>
          </div>

          <div className="flex flex-col gap-3">
            <Panel title="Approval trail">
              <ul className="flex flex-col gap-2 text-[11px]">
                {[
                  { who: "Estimate sent", when: "Jun 4 · 4:12 PM", tone: "slate" as const },
                  { who: "Owner approved $699.50", when: "Jun 4 · 6:38 PM", tone: "green" as const },
                  { who: "Tech assigned · Cory E.", when: "Jun 5 · 7:02 AM", tone: "cyan" as const },
                ].map((e) => (
                  <li key={e.who} className="flex items-start justify-between gap-2">
                    <span className="text-white/80">{e.who}</span>
                    <span className="shrink-0 font-mono text-[10px] text-white/60">{e.when}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2.5 flex items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-2 py-1.5 text-[10px] text-emerald-100">
                <PenLine className="h-3 w-3 shrink-0" aria-hidden="true" />
                Digital signature captured on the owner&apos;s phone
              </div>
            </Panel>

            <Panel title="Field notes & photos">
              <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
                {[
                  "from-teal-500/25 to-brand-800",
                  "from-amber-500/20 to-brand-800",
                  "from-brand-600/40 to-brand-900",
                ].map((g, i) => (
                  <span
                    key={i}
                    className={`grid aspect-[4/3] place-items-center rounded bg-gradient-to-br ${g}`}
                  >
                    <Camera className="h-3.5 w-3.5 text-white/60" aria-hidden="true" />
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-white/60">
                &ldquo;Port outer showing 12% compression variance on cyl 3. Recommend borescope before
                quoting a repower.&rdquo;
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Avatar initials="CE" />
                <span className="text-[10px] text-white/60">Cory E. · synced from the field app</span>
              </div>
            </Panel>
          </div>
        </div>
      </AppShell>
    </PreviewFrame>
  );
}

/* ----------------------------------------- 5. Estimate → invoice workflow */

export function EstimateToInvoicePreview() {
  return (
    <PreviewFrame
      title="Estimate to invoice"
      caption="Approve, convert, and collect through Stripe without re-typing the job."
      testId="preview-estimate-invoice"
    >
      <AppShell
        nav={NAV}
        active="Invoices"
        header={
          <>
            <h3 className="font-display text-sm font-bold">EST-0912 → INV-1108</h3>
            <Pill tone="green">Paid · Stripe</Pill>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Approval time" value="2h 26m" sub="Sent 4:12 PM · approved 6:38 PM" />
          <Metric label="Invoice sent" value="Same day" sub="Auto-generated from the work order" tone="amber" />
          <Metric label="Paid" value="$699.50" sub="Card · Stripe payout T+2" tone="green" />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {[
            {
              step: "1 · Estimate",
              tone: "slate" as const,
              status: "Approved",
              body: [
                ["Labor", "$507.50"],
                ["Parts", "$168.00"],
                ["Supplies", "$24.00"],
              ],
              foot: "Owner approved on their phone — no paperwork at the dock.",
            },
            {
              step: "2 · Invoice",
              tone: "cyan" as const,
              status: "Issued",
              body: [
                ["Subtotal", "$699.50"],
                ["Tax (FL 7%)", "$48.97"],
                ["Total due", "$748.47"],
              ],
              foot: "Converted from the approved estimate in one click.",
            },
            {
              step: "3 · Payment",
              tone: "green" as const,
              status: "Settled",
              body: [
                ["Method", "Visa ···· 4242"],
                ["Processor fee", "$21.99"],
                ["Net to you", "$726.48"],
              ],
              foot: "Processed by Stripe. HarborIQ never stores card numbers.",
            },
          ].map((card) => (
            <Panel
              key={card.step}
              title={card.step}
              action={<Pill tone={card.tone}>{card.status}</Pill>}
            >
              <dl className="flex flex-col gap-1.5 text-[11px]">
                {card.body.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2">
                    <dt className="text-white/50">{k}</dt>
                    <dd className="font-mono text-white/85">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2.5 border-t border-white/8 pt-2 text-[10px] leading-snug text-white/45">
                {card.foot}
              </p>
            </Panel>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
          <CreditCard className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
          <span className="text-[11px] text-white/70">
            Payments and payouts run on Stripe, including Stripe Connect. Card data never touches HarborIQ.
          </span>
          <span className="ml-auto font-mono text-[10px] text-white/30">Sample transaction</span>
        </div>
      </AppShell>
    </PreviewFrame>
  );
}

/* --------------------------------------------- 6. Marina slip management */

export function SlipManagementPreview() {
  // Deterministic dock layout: A/B/C rows with occupancy states.
  const docks = [
    { row: "A", slips: ["occ", "occ", "res", "occ", "open", "occ", "occ", "hold"] },
    { row: "B", slips: ["occ", "occ", "occ", "occ", "res", "open", "occ", "occ"] },
    { row: "C", slips: ["open", "occ", "hold", "occ", "occ", "occ", "open", "res"] },
  ];

  const legend: { key: string; tone: string; label: string }[] = [
    { key: "occ", tone: "bg-teal-400/70 border-teal-300/40", label: "Occupied · lease current" },
    { key: "res", tone: "bg-amber-400/70 border-amber-300/40", label: "Reserved · arriving" },
    { key: "hold", tone: "bg-rose-400/60 border-rose-300/40", label: "Hold · lease expiring" },
    { key: "open", tone: "bg-white/8 border-white/20", label: "Open" },
  ];

  const toneFor = (k: string) => legend.find((l) => l.key === k)?.tone ?? "bg-white/8";

  return (
    <PreviewFrame
      title="Slip management"
      caption="Berth occupancy, lease status, and billing in one map — double-booking blocked at assignment."
      testId="preview-slip-management"
    >
      <AppShell
        nav={NAV}
        active="Slips"
        header={
          <>
            <h3 className="font-display text-sm font-bold">Harbor map · 24 berths</h3>
            <Pill tone="cyan">83% occupancy</Pill>
            <Pill tone="amber">3 leases expiring</Pill>
          </>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[1.2fr,1fr]">
          <Panel title="Dock layout">
            <div className="flex flex-col gap-2.5">
              {docks.map((dock) => (
                <div key={dock.row} className="flex items-center gap-2">
                  <span className="w-4 shrink-0 font-mono text-[11px] text-white/60">{dock.row}</span>
                  <div className="grid flex-1 grid-cols-8 gap-1.5">
                    {dock.slips.map((s, i) => (
                      <span
                        key={i}
                        className={`grid h-8 place-items-center rounded border font-mono text-[9px] text-brand-950/80 ${toneFor(s)}`}
                        title={`Slip ${dock.row}-${String(i + 1).padStart(2, "0")}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {legend.map((l) => (
                <li key={l.key} className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className={`h-2.5 w-2.5 rounded border ${l.tone}`} aria-hidden="true" />
                  {l.label}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-white/60">
              Status is shown by label as well as color, so nothing depends on color alone.
            </p>
          </Panel>

          <div className="flex flex-col gap-3">
            <Panel title="Assign vessel to B-06">
              <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
                <Ship className="h-3.5 w-3.5 shrink-0 text-teal-300" aria-hidden="true" />
                <span className="text-[11px] text-white/85">38′ Yellowfin · Barlow</span>
                <span className="ml-auto font-mono text-[10px] text-white/60">LOA 38′ · beam 11′</span>
              </div>
              <ul className="mt-2 flex flex-col gap-1.5 text-[10px]">
                <li className="flex items-center gap-1.5 text-emerald-200">
                  <Check className="h-3 w-3 shrink-0" aria-hidden="true" /> Berth dimensions clear (40′ × 13′)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-200">
                  <Check className="h-3 w-3 shrink-0" aria-hidden="true" /> No overlapping reservation Jun 9 – Sep 30
                </li>
                <li className="flex items-center gap-1.5 text-amber-200">
                  <Anchor className="h-3 w-3 shrink-0" aria-hidden="true" /> 30A power pedestal — vessel requests 50A
                </li>
              </ul>
              <div className="mt-2.5 rounded-md border border-teal-400/30 bg-teal-400/10 px-2 py-1.5 text-center text-[10px] font-semibold text-teal-100">
                Confirm assignment & start billing
              </div>
            </Panel>

            <Panel title="Lease & billing">
              <div className="flex flex-col gap-2 text-[11px]">
                {[
                  ["C-07 · Nguyen", "Expires Fri", 92, "amber"],
                  ["A-08 · Whitaker", "Renews Oct 1", 34, "cyan"],
                  ["B-05 · Alvarez", "Arriving Jun 14", 12, "cyan"],
                ].map(([name, note, pct, tone]) => (
                  <div key={name as string}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-white/80">{name}</span>
                      <span className="shrink-0 text-[10px] text-white/45">{note}</span>
                    </div>
                    <div className="mt-1">
                      <ProgressTrack pct={pct as number} tone={tone as "amber" | "cyan"} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[10px] text-white/60">
                Slip fees invoice through the same Stripe flow as service work.
              </p>
            </Panel>
          </div>
        </div>

        <div className="mt-3">
          <AiNote>
            Assignment checks berth dimensions, power, and date overlap before it lets a slip be committed —
            the double-booking is prevented at the point of assignment, not discovered at the dock.
          </AiNote>
        </div>
      </AppShell>
    </PreviewFrame>
  );
}
