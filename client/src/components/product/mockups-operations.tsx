import {
  AiNote,
  AppShell,
  BarSeries,
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
  CalendarClock,
  ClipboardList,
  Gauge,
  MapPin,
  Radar,
  Receipt,
  Users,
  Wrench,
  AlertTriangle,
  TrendingUp,
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

/* ------------------------------------------------ 1. Operations dashboard */

export function OperationsDashboardPreview() {
  return (
    <PreviewFrame
      title="Operations dashboard"
      caption="The morning view: what's booked, what's blocked, and what's owed."
      testId="preview-operations-dashboard"
    >
      <AppShell
        nav={NAV}
        active="Dashboard"
        header={
          <>
            <h3 className="font-display text-sm font-bold">Today · Tuesday, June 9</h3>
            <Pill tone="green">All techs checked in</Pill>
            <span className="ml-auto hidden font-mono text-[10px] text-white/60 sm:inline">
              Sample data
            </span>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Jobs scheduled" value="14" sub="3 unassigned" />
          <Metric label="Techs on the water" value="4 / 5" sub="1 on a haul-out" />
          <Metric label="Awaiting approval" value="$8,420" sub="6 estimates out" tone="amber" />
          <Metric label="Collected this week" value="$21,960" sub="Stripe, net of fees" tone="green" />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr,1fr]">
          <Panel
            title="Today's schedule"
            action={<span className="font-mono text-[10px] text-white/60">7:00 – 17:00</span>}
          >
            <ul className="flex flex-col gap-2">
              {[
                {
                  time: "08:00",
                  job: "Repower survey · 42′ Pursuit",
                  where: "Marina Jack · Slip B-14",
                  tech: "CE",
                  tone: "cyan" as const,
                  status: "En route",
                },
                {
                  time: "10:30",
                  job: "Trim tab actuator replace · 31′ Contender",
                  where: "Sarasota Bayfront · Slip D-02",
                  tech: "RM",
                  tone: "green" as const,
                  status: "In progress",
                },
                {
                  time: "13:00",
                  job: "No-start diagnostic · 24′ Pathfinder",
                  where: "Customer driveway · Osprey",
                  tech: "—",
                  tone: "amber" as const,
                  status: "Unassigned",
                },
                {
                  time: "15:15",
                  job: "200-hour service · twin Yamaha F300",
                  where: "Hidden Harbor · Rack 118",
                  tech: "JL",
                  tone: "cyan" as const,
                  status: "Scheduled",
                },
              ].map((row) => (
                <li
                  key={row.time}
                  className="flex items-center gap-3 rounded-md border border-white/8 bg-white/[0.02] px-2.5 py-2"
                >
                  <span className="w-10 shrink-0 font-mono text-[11px] text-white/45">{row.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-medium text-white/90">{row.job}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-white/60">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{row.where}</span>
                    </span>
                  </span>
                  <Pill tone={row.tone}>{row.status}</Pill>
                  {row.tech === "—" ? (
                    <span className="w-6 text-center text-[10px] text-white/30">—</span>
                  ) : (
                    <Avatar initials={row.tech} />
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <AiNote>
                The 13:00 no-start call is 6 minutes from Rob&apos;s 10:30 job. Assigning it to Rob saves an
                estimated 41 minutes of drive time today.
              </AiNote>
            </div>
          </Panel>

          <div className="flex flex-col gap-3">
            <Panel title="Revenue · last 7 days">
              <BarSeries
                data={[2100, 3450, 2890, 4120, 3310, 5180, 960]}
                labels={["W", "T", "F", "S", "S", "M", "T"]}
              />
              <p className="mt-2 flex items-center gap-1.5 text-[10px] text-white/45">
                <TrendingUp className="h-3 w-3 text-emerald-300" aria-hidden="true" />
                Invoiced $21,960 · $3,180 outstanding
              </p>
            </Panel>

            <Panel title="Needs attention">
              <ul className="flex flex-col gap-2 text-[11px]">
                {[
                  { icon: AlertTriangle, tone: "text-amber-300", text: "Slip C-07 lease ends Friday — renewal not sent" },
                  { icon: Receipt, tone: "text-rose-300", text: "Invoice #1042 · 14 days past due · $1,240" },
                  { icon: Wrench, tone: "text-teal-300", text: "Impeller stock at 2 units — 4 services booked" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-white/70">
                    <item.icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.tone}`} aria-hidden="true" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </AppShell>
    </PreviewFrame>
  );
}

/* ------------------------------------------------------- 2. Dispatch board */

export function DispatchBoardPreview() {
  const columns = [
    {
      title: "Unassigned",
      tone: "amber" as const,
      cards: [
        { job: "No-start diagnostic", boat: "24′ Pathfinder", meta: "Osprey · 13:00", score: 92 },
        { job: "Bilge pump replace", boat: "34′ SeaVee", meta: "Longboat Key · flexible", score: 61 },
      ],
    },
    {
      title: "Cory E. · ABYC",
      tone: "cyan" as const,
      cards: [
        { job: "Repower survey", boat: "42′ Pursuit", meta: "Slip B-14 · 08:00", score: 88 },
        { job: "Gauge cluster fault", boat: "38′ Yellowfin", meta: "Slip A-09 · 11:00", score: 74 },
      ],
    },
    {
      title: "Rob M. · Tech II",
      tone: "green" as const,
      cards: [
        { job: "Trim tab actuator", boat: "31′ Contender", meta: "Slip D-02 · in progress", score: 80 },
      ],
    },
    {
      title: "Jess L. · Tech I",
      tone: "violet" as const,
      cards: [
        { job: "200-hour service", boat: "Twin F300", meta: "Rack 118 · 15:15", score: 69 },
        { job: "Anode inspection", boat: "27′ Regulator", meta: "Rack 044 · 16:30", score: 44 },
      ],
    },
  ];

  return (
    <PreviewFrame
      title="Dispatch board"
      caption="Drag-and-drop assignment with explainable job scoring by fit, urgency, and drive time."
      testId="preview-dispatch-board"
    >
      <AppShell
        nav={NAV}
        active="Dispatch"
        header={
          <>
            <h3 className="font-display text-sm font-bold">Dispatch · Tue Jun 9</h3>
            <Pill tone="amber">2 unassigned</Pill>
            <Pill tone="cyan">Scoring on</Pill>
          </>
        }
      >
        {/* Horizontally scrollable and has no focusable children, so it needs to be
            focusable itself for keyboard users (WCAG 2.1.1). */}
        <div
          className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
          tabIndex={0}
          role="group"
          aria-label="Dispatch board columns — scroll horizontally"
        >
          {columns.map((col) => (
            <div key={col.title} className="w-[210px] shrink-0 snap-start">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-semibold text-white/75">{col.title}</span>
                <Pill tone={col.tone}>{col.cards.length}</Pill>
              </div>
              <div className="flex flex-col gap-2">
                {col.cards.map((card) => (
                  <article
                    key={card.job}
                    className="rounded-md border border-white/8 bg-white/[0.03] p-2.5"
                  >
                    <p className="text-[11px] font-medium text-white/90">{card.job}</p>
                    <p className="mt-0.5 text-[10px] text-white/45">{card.boat}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] text-white/60">
                      <CalendarClock className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{card.meta}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressTrack pct={card.score} tone={card.score > 75 ? "cyan" : "amber"} />
                      <span className="shrink-0 font-mono text-[9px] text-white/45">{card.score}</span>
                    </div>
                    <p className="mt-1 text-[9px] uppercase tracking-wide text-white/30">Priority score</p>
                  </article>
                ))}
                {col.cards.length === 0 && (
                  <p className="rounded-md border border-dashed border-white/10 px-2 py-6 text-center text-[10px] text-white/30">
                    Drop a job here
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <AiNote>
            Scores weigh customer urgency, technician certification, parts on the truck, and distance from the
            previous stop. A dispatcher can always override — the score is a suggestion, never an automatic
            assignment.
          </AiNote>
        </div>
      </AppShell>
    </PreviewFrame>
  );
}

/* ---------------------------------------- 3. Maintenance intelligence view */

export function MaintenanceIntelligencePreview() {
  const rows = [
    {
      boat: "42′ Pursuit S 408",
      owner: "Whitaker",
      hours: "1,182 hrs",
      due: "200-hour service",
      window: "Due in 9 days",
      tone: "amber" as const,
      value: "$1,850",
    },
    {
      boat: "31′ Contender",
      owner: "Alvarez",
      hours: "640 hrs",
      due: "Impeller + thermostats",
      window: "Due in 3 weeks",
      tone: "cyan" as const,
      value: "$780",
    },
    {
      boat: "27′ Regulator",
      owner: "Nguyen",
      hours: "2,410 hrs",
      due: "Anodes + lower unit oil",
      window: "Overdue 12 days",
      tone: "red" as const,
      value: "$420",
    },
    {
      boat: "38′ Yellowfin",
      owner: "Barlow",
      hours: "915 hrs",
      due: "Steering fluid service",
      window: "Due in 6 weeks",
      tone: "slate" as const,
      value: "$310",
    },
  ];

  return (
    <PreviewFrame
      title="Maintenance intelligence"
      caption="Engine-hour and service-history signals turned into a recurring-revenue queue."
      testId="preview-maintenance-intelligence"
    >
      <AppShell
        nav={NAV}
        active="Reports"
        header={
          <>
            <h3 className="font-display text-sm font-bold">Maintenance intelligence</h3>
            <Pill tone="cyan">Next 90 days</Pill>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Services coming due" value="37" sub="Across 24 vessels" />
          <Metric label="Estimated pipeline" value="$28,400" sub="If every reminder converts" tone="amber" />
          <Metric label="Overdue services" value="5" sub="Reminder not yet sent" tone="green" />
        </div>

        <Panel
          title="Due-soon queue"
          className="mt-3"
          action={
            <span className="rounded border border-teal-400/30 bg-teal-400/10 px-1.5 py-0.5 text-[10px] font-medium text-teal-200">
              Send reminders
            </span>
          }
        >
          <div
            className="-mx-3 overflow-x-auto px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            tabIndex={0}
            role="group"
            aria-label="Maintenance intelligence table — scroll horizontally"
          >
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-white/60">
                  <th className="pb-2 font-medium">Vessel</th>
                  <th className="pb-2 font-medium">Engine hours</th>
                  <th className="pb-2 font-medium">Service due</th>
                  <th className="pb-2 font-medium">Window</th>
                  <th className="pb-2 text-right font-medium">Est. value</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {rows.map((r) => (
                  <tr key={r.boat} className="border-t border-white/8">
                    <td className="py-2 pr-3">
                      <span className="block font-medium text-white/90">{r.boat}</span>
                      <span className="text-[10px] text-white/60">{r.owner}</span>
                    </td>
                    <td className="py-2 pr-3 font-mono text-white/60">{r.hours}</td>
                    <td className="py-2 pr-3 text-white/70">{r.due}</td>
                    <td className="py-2 pr-3">
                      <Pill tone={r.tone}>{r.window}</Pill>
                    </td>
                    <td className="py-2 text-right font-mono text-white/80">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="mt-3">
          <AiNote>
            Intervals come from each vessel&apos;s logged engine hours and service history in HarborIQ, so the
            queue reflects the work you actually performed — not a generic calendar rule.
          </AiNote>
        </div>
      </AppShell>
    </PreviewFrame>
  );
}
