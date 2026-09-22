import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Clock, TrendingUp } from "lucide-react";

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function RoiCalculator() {
  const [jobsPerWeek, setJobsPerWeek] = useState(20);
  const [avgTicket, setAvgTicket] = useState(350);
  const [hoursLost, setHoursLost] = useState(8);

  const results = useMemo(() => {
    // Estimate: HarborIQ typically recovers ~60% of hours currently lost to
    // paperwork, scheduling calls, and no-show follow-up, plus prevents an
    // estimated ~5% of weekly jobs from being lost to scheduling friction/no-shows.
    const hoursRecoveredPerWeek = hoursLost * 0.6;
    const jobsRecoveredPerWeek = jobsPerWeek * 0.05;
    const monthlyHoursRecovered = hoursRecoveredPerWeek * 4.33;
    const monthlyRevenueFromJobs = jobsRecoveredPerWeek * avgTicket * 4.33;
    // Recovered admin hours are valued at the average ticket's implied hourly
    // rate, assumed at a conservative 1.5-hour average job length.
    const impliedHourlyValue = avgTicket / 1.5;
    const monthlyRevenueFromHours = monthlyHoursRecovered * impliedHourlyValue * 0.5;
    const totalMonthlyRevenue = monthlyRevenueFromJobs + monthlyRevenueFromHours;

    return {
      monthlyHoursRecovered: Math.round(monthlyHoursRecovered),
      totalMonthlyRevenue: Math.round(totalMonthlyRevenue),
    };
  }, [jobsPerWeek, avgTicket, hoursLost]);

  return (
    <Card className="overflow-hidden" data-testid="card-roi-calculator">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
          <Calculator className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-wide">Fit & ROI Estimate</span>
        </div>
        <h3 className="mt-3 text-xl font-display font-bold text-foreground">
          See what HarborIQ could recover for your business
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          This is a directional estimate based on your inputs below, not a guaranteed figure — actual
          results depend on your current workflow and team adoption.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <SliderField
              label="Jobs completed per week"
              value={jobsPerWeek}
              onChange={setJobsPerWeek}
              min={2}
              max={100}
              step={1}
              suffix="jobs/wk"
              testId="jobs-per-week"
            />
            <SliderField
              label="Average ticket size"
              value={avgTicket}
              onChange={setAvgTicket}
              min={75}
              max={2000}
              step={25}
              format={(v) => formatCurrency(v)}
              testId="avg-ticket"
            />
            <SliderField
              label="Hours/week lost to paperwork & no-shows"
              value={hoursLost}
              onChange={setHoursLost}
              min={1}
              max={40}
              step={1}
              suffix="hrs/wk"
              testId="hours-lost"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-card-border bg-muted/50 p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wide">Est. hours recovered / month</span>
              </div>
              <p className="mt-2 text-xl font-display font-bold text-foreground" data-testid="text-roi-hours">
                {results.monthlyHoursRecovered} hrs
              </p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-5">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wide">Est. revenue recovered / month</span>
              </div>
              <p className="mt-2 text-xl font-display font-bold text-foreground" data-testid="text-roi-revenue">
                {formatCurrency(results.totalMonthlyRevenue)}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Estimate only — based on illustrative assumptions (60% of lost admin hours recovered, ~5% fewer
          missed jobs from scheduling friction). Not a guarantee of results.
        </p>
      </CardContent>
    </Card>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  format,
  testId,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  format?: (v: number) => string;
  testId: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground" htmlFor={`slider-${testId}`}>
          {label}
        </label>
        <span className="text-sm font-semibold text-foreground" data-testid={`text-${testId}-value`}>
          {format ? format(value) : `${value} ${suffix ?? ""}`}
        </span>
      </div>
      <Slider
        id={`slider-${testId}`}
        className="mt-3"
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
        data-testid={`slider-${testId}`}
        thumbLabel={label}
      />
    </div>
  );
}
