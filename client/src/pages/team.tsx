import { usePageMeta } from "@/hooks/use-page-meta";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Logo } from "@/components/site/logo";
import { apiRequest } from "@/lib/queryClient";
import { teamSizeLabels, businessTypeLabels, preferredContactLabels } from "@/lib/site-config";
import type { Lead } from "@shared/schema";
import {
  Lock,
  Loader2,
  Download,
  Users,
  Mail,
  ArrowUpDown,
  LogOut,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const CHART_COLORS = ["#F5A623", "#1FA6A0", "#153A5C", "#2E9E5B", "#A12C7B"];

type SortKey = "createdAt" | "fullName" | "businessName" | "teamSize" | "source";

export default function Team() {
  usePageMeta({
    title: "Team Dashboard",
    description: "Internal HarborIQ leads dashboard — admin token required.",
    path: "/team",
  });

  const [token, setToken] = useState<string | null>(null);

  if (!token) {
    return <TeamLogin onAuthenticated={setToken} />;
  }

  return <TeamDashboard token={token} onLogout={() => setToken(null)} />;
}

function TeamLogin({ onAuthenticated }: { onAuthenticated: (token: string) => void }) {
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setChecking(true);
    try {
      await apiRequest("GET", "/api/leads", undefined, {
        Authorization: `Bearer ${input.trim()}`,
      });
      onAuthenticated(input.trim());
    } catch (err) {
      setError(
        String(err).includes("401")
          ? "That token was rejected. Check it and try again."
          : "Couldn't reach the server. Try again in a moment.",
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-900 px-4">
      <Card className="w-full max-w-sm bg-brand-800 border-white/10">
        <CardContent className="p-8">
          <Logo className="[&_span]:text-white" />
          <div className="mt-6 flex items-center gap-2 text-amber-400">
            <Lock className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">Team dashboard</span>
          </div>
          <h1 className="mt-2 text-lg font-display font-bold text-white">Enter admin token</h1>
          <p className="mt-2 text-sm text-white/60">
            This matches the same <code className="rounded bg-white/10 px-1 py-0.5 text-xs">Authorization: Bearer</code>{" "}
            contract as the production leads API.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <Input
              type="password"
              placeholder="Admin token"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
              data-testid="input-admin-token"
              autoFocus
            />
            {error && (
              <p className="flex items-center gap-2 text-sm text-red-400" role="alert" data-testid="text-login-error">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}
              </p>
            )}
            <Button type="submit" disabled={checking || !input.trim()} className="w-full" data-testid="button-team-login">
              {checking ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-md border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-200">
            The token is read from the server's{" "}
            <code className="rounded bg-black/20 px-1 py-0.5 font-mono">ADMIN_TOKEN</code> environment
            variable. It is never stored in the browser or shipped in this bundle — you'll re-enter it
            each session.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [search, setSearch] = useState("");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery<{ ok: boolean; leads: Lead[] }>({
    queryKey: ["/api/leads", token],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/leads", undefined, {
        Authorization: `Bearer ${token}`,
      });
      return res.json();
    },
    retry: false,
  });

  const leads = data?.leads ?? [];

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))).sort(), [leads]);

  const filtered = useMemo(() => {
    let rows = leads;
    if (teamSizeFilter !== "all") rows = rows.filter((l) => l.teamSize === teamSizeFilter);
    if (sourceFilter !== "all") rows = rows.filter((l) => l.source === sourceFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.businessName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [leads, teamSizeFilter, sourceFilter, search, sortKey, sortDir]);

  const byTeamSize = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of leads) counts[l.teamSize] = (counts[l.teamSize] ?? 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name: teamSizeLabels[name] ?? name, value }));
  }, [leads]);

  const bySource = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of leads) counts[l.source] = (counts[l.source] ?? 0) + 1;
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const enrichedCount = useMemo(() => leads.filter((l) => Boolean(l.enrichedAt)).length, [leads]);
  const enrichedPct = leads.length === 0 ? 0 : Math.round((enrichedCount / leads.length) * 100);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function exportCsv() {
    const header = [
      "Full Name",
      "Business Name",
      "Email",
      "Team Size",
      "Source",
      "Created At",
      "Notified At",
      "Phone",
      "Business Type",
      "Fleet / Jobs",
      "Current Software",
      "Biggest Pain",
      "Heard About",
      "Preferred Contact",
      "Enriched At",
    ];
    const rows = filtered.map((l) => [
      l.fullName,
      l.businessName,
      l.email,
      teamSizeLabels[l.teamSize] ?? l.teamSize,
      l.source,
      l.createdAt,
      l.notifiedAt ?? "",
      l.phone ?? "",
      l.businessType ? businessTypeLabels[l.businessType] ?? l.businessType : "",
      l.fleetOrJobs ?? "",
      l.currentSoftware ?? "",
      l.biggestPain ?? "",
      l.heardAbout ?? "",
      l.preferredContact ? preferredContactLabels[l.preferredContact] ?? l.preferredContact : "",
      l.enrichedAt ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harboriq-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-900 px-4">
        <Card className="max-w-sm bg-brand-800 border-white/10">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" aria-hidden="true" />
            <p className="mt-4 text-sm text-white/80">Your session was rejected by the server. Please sign in again.</p>
            <Button className="mt-6" onClick={onLogout} data-testid="button-relogin">
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-card-border bg-brand-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Logo className="[&_span]:text-white" />
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-white/20 text-white/70">
              Admin session
            </Badge>
            <Button variant="outline" size="sm" onClick={onLogout} className="bg-white/5 text-white border-white/20 hover:bg-white/10" data-testid="button-logout">
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-xl font-display font-bold text-foreground">Leads Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live data from <code className="rounded bg-muted px-1 py-0.5 text-xs">GET /api/leads</code>.
        </p>

        {isLoading ? (
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading leads…
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Total leads" value={leads.length} testId="total-leads" />
              <StatCard icon={Mail} label="Unique sources" value={sources.length} testId="unique-sources" />
              <StatCard
                icon={Users}
                label="Last 24 hours"
                value={leads.filter((l) => Date.now() - new Date(l.createdAt).getTime() < 86400000).length}
                testId="leads-24h"
              />
              <StatCard
                icon={Sparkles}
                label="% enriched"
                value={`${enrichedPct}%`}
                hint={`${enrichedCount} of ${leads.length} completed step 2`}
                testId="pct-enriched"
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-sm font-semibold text-foreground">Leads by team size</h2>
                  <div className="mt-4 h-64">
                    {byTeamSize.length === 0 ? (
                      <EmptyChart />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={byTeamSize} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                            {byTeamSize.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {byTeamSize.map((d, i) => (
                      <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                        {d.name} ({d.value})
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-sm font-semibold text-foreground">Leads by source</h2>
                  <div className="mt-4 h-64">
                    {bySource.length === 0 ? (
                      <EmptyChart />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bySource} layout="vertical" margin={{ left: 8, right: 16 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                          <Bar dataKey="value" fill="#F5A623" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-sm font-semibold text-foreground">All leads ({filtered.length})</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      placeholder="Search name, business, email…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-56"
                      data-testid="input-search-leads"
                    />
                    <Select value={teamSizeFilter} onValueChange={setTeamSizeFilter}>
                      <SelectTrigger className="w-36" data-testid="select-filter-team-size">
                        <SelectValue placeholder="Team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All team sizes</SelectItem>
                        {Object.entries(teamSizeLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="w-40" data-testid="select-filter-source">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sources</SelectItem>
                        {sources.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={exportCsv} data-testid="button-export-csv">
                      <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
                    </Button>
                  </div>
                </div>

                <div
                  className="mt-6 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  tabIndex={0}
                  role="group"
                  aria-label="Leads table — scroll horizontally"
                >
                  <Table className="min-w-[1040px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <span className="sr-only">Expand lead details</span>
                        </TableHead>
                        <SortableHead label="Name" sortKey="fullName" current={sortKey} dir={sortDir} onSort={toggleSort} />
                        <SortableHead label="Business" sortKey="businessName" current={sortKey} dir={sortDir} onSort={toggleSort} />
                        <TableHead>Email</TableHead>
                        <SortableHead label="Team size" sortKey="teamSize" current={sortKey} dir={sortDir} onSort={toggleSort} />
                        <SortableHead label="Source" sortKey="source" current={sortKey} dir={sortDir} onSort={toggleSort} />
                        <SortableHead label="Created" sortKey="createdAt" current={sortKey} dir={sortDir} onSort={toggleSort} />
                        <TableHead>Notified</TableHead>
                        <TableHead>Enriched</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                            No leads match your filters yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.flatMap((lead) => [
                          <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                            <TableCell>
                              <button
                                type="button"
                                onClick={() => setExpanded((cur) => (cur === lead.id ? null : lead.id))}
                                aria-expanded={expanded === lead.id}
                                aria-label={`${expanded === lead.id ? "Hide" : "Show"} details for ${lead.fullName}`}
                                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                data-testid={`button-expand-lead-${lead.id}`}
                              >
                                {expanded === lead.id ? (
                                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell className="font-medium">{lead.fullName}</TableCell>
                            <TableCell>{lead.businessName}</TableCell>
                            <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{teamSizeLabels[lead.teamSize] ?? lead.teamSize}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {lead.notifiedAt ? (
                                <Badge className="bg-teal-600 hover:bg-teal-600">Notified</Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {lead.enrichedAt ? (
                                <Badge className="bg-amber-500 text-brand-950 hover:bg-amber-500">Enriched</Badge>
                              ) : (
                                <Badge variant="outline">Step 1 only</Badge>
                              )}
                            </TableCell>
                          </TableRow>,
                          ...(expanded === lead.id
                            ? [
                                <TableRow key={`${lead.id}-details`} data-testid={`row-lead-details-${lead.id}`}>
                                  <TableCell colSpan={9} className="bg-muted/20 p-3">
                                    <LeadDetails lead={lead} />
                                  </TableCell>
                                </TableRow>,
                              ]
                            : []),
                        ])
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  testId,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  testId: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className="mt-2 text-xl font-display font-bold text-foreground" data-testid={`text-stat-${testId}`}>
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

/** Expandable detail row showing every Step 2 enrichment field for one lead. */
function LeadDetails({ lead }: { lead: Lead }) {
  const fields: { label: string; value: string | null }[] = [
    { label: "Phone", value: lead.phone },
    {
      label: "Business type",
      value: lead.businessType ? businessTypeLabels[lead.businessType] ?? lead.businessType : null,
    },
    { label: "Fleet / jobs", value: lead.fleetOrJobs },
    { label: "Current software", value: lead.currentSoftware },
    { label: "Heard about us", value: lead.heardAbout },
    {
      label: "Preferred contact",
      value: lead.preferredContact
        ? preferredContactLabels[lead.preferredContact] ?? lead.preferredContact
        : null,
    },
    { label: "Enriched at", value: lead.enrichedAt ? new Date(lead.enrichedAt).toLocaleString() : null },
  ];

  const hasAny = fields.some((f) => f.value) || Boolean(lead.biggestPain);

  return (
    <div className="rounded-md bg-muted/40 p-4" data-testid={`details-lead-${lead.id}`}>
      {!hasAny ? (
        <p className="text-sm text-muted-foreground">
          No discovery answers yet — this lead stopped after step 1.
        </p>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-sm text-foreground">{f.value ?? "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Biggest headache
            </dt>
            <dd className="mt-1 max-w-3xl whitespace-pre-wrap text-sm text-foreground">
              {lead.biggestPain ?? "—"}
            </dd>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyChart() {
  return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>;
}

function SortableHead({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  return (
    <TableHead>
      <button
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 hover:text-foreground"
        data-testid={`button-sort-${sortKey}`}
      >
        {label}
        <ArrowUpDown className={`h-3 w-3 ${current === sortKey ? "text-foreground" : "text-muted-foreground/40"}`} aria-hidden="true" />
        {current === sortKey && <span className="sr-only">({dir})</span>}
      </button>
    </TableHead>
  );
}
