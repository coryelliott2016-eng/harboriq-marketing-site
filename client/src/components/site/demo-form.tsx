import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { apiRequest, leadSubmissionError } from "@/lib/queryClient";
import { LeadAvailabilityGate } from "./lead-availability";
import { track } from "@/lib/analytics";
import { teamSizeValues, businessTypeValues, preferredContactValues, type LeadResponse } from "@shared/schema";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

const SOURCE = "demo_page";

/** Step 1 — the existing required contract. Submitted on its own so an abandoned
 *  Step 2 never costs us the lead. */
const stepOneSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name"),
  businessName: z.string().trim().min(1, "Enter your business name"),
  email: z.string().trim().email("Enter a valid email address"),
  teamSize: z.enum(teamSizeValues, { message: "Select a team size" }),
  website: z.string(),
});
type StepOneValues = z.infer<typeof stepOneSchema>;

/** Step 2 — optional discovery fields, sent to /api/leads/:id/enrich. */
const stepTwoSchema = z.object({
  phone: z.string().trim().max(40).optional(),
  businessType: z.enum(businessTypeValues).optional(),
  fleetOrJobs: z.string().trim().max(200).optional(),
  currentSoftware: z.string().trim().max(200).optional(),
  biggestPain: z.string().trim().max(2000).optional(),
  heardAbout: z.string().trim().max(200).optional(),
  preferredContact: z.enum(preferredContactValues).optional(),
});
type StepTwoValues = z.infer<typeof stepTwoSchema>;

export function DemoForm() {
  return <LeadAvailabilityGate><AvailableDemoForm /></LeadAvailabilityGate>;
}

function AvailableDemoForm() {
  const [step, setStep] = useState<1 | 2 | "done">(1);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [result, setResult] = useState<LeadResponse | null>(null);

  if (step === "done" && result) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-lg border border-teal-500/30 bg-teal-50 px-6 py-10 text-center dark:bg-teal-950/20"
        data-testid="text-lead-success"
      >
        <CheckCircle2 className="h-8 w-8 text-teal-700" aria-hidden="true" />
        <p className="text-base font-medium text-foreground">{result.message}</p>
        {!result.duplicate && (
          <p className="text-sm text-muted-foreground">We typically respond within one business day.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span data-testid="text-demo-step-label">Request details</span>
          <span>Your business</span>
        </div>
        <Progress
          value={100}
          className="mt-2 h-1.5"
          aria-label="Demo request form"
          data-testid="progress-demo-steps"
        />
      </div>

      {step === 1 ? (
        <StepOne
          onSubmitted={(id, res) => {
            setLeadId(id);
            setResult(res);
            // Optional enrichment is currently admin-only. Do not send a
            // visitor into a second step that the public API cannot accept.
            setStep("done");
          }}
        />
      ) : (
        <StepTwo
          leadId={leadId}
          onFinish={() => setStep("done")}
        />
      )}
    </div>
  );
}

function StepOne({ onSubmitted }: { onSubmitted: (id: number | null, res: LeadResponse) => void }) {
  const [failed, setFailed] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);

  /** Fires once, on the visitor's first real interaction with the form. */
  function noteStart() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form: SOURCE });
  }

  const form = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      teamSize: undefined as unknown as StepOneValues["teamSize"],
      website: "",
    },
  });

  async function onSubmit(values: StepOneValues) {
    setFailed(null);
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/leads", { ...values, source: SOURCE });
      const data = (await res.json()) as LeadResponse;
      track("form_complete", { form: SOURCE, step: 1, duplicate: Boolean(data.duplicate) });
      onSubmitted(data.id, data);
    } catch (error) {
      setFailed(leadSubmissionError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onFocusCapture={noteStart}
        onChangeCapture={noteStart}
        className="flex flex-col gap-4"
        data-testid="form-lead-demo_page"
        noValidate
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">Request access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four quick fields. That's all we need to get back to you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Jamie Rivera" {...field} data-testid="input-full-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business name</FormLabel>
                <FormControl>
                  <Input autoComplete="organization" placeholder="Rivera Marine Services" {...field} data-testid="input-business-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="jamie@riveramarine.com" {...field} data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team size</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-team-size">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="solo">Solo — just me</SelectItem>
                  <SelectItem value="team">Team — up to ~10 people</SelectItem>
                  <SelectItem value="business">Business — multiple crews/locations</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: visually hidden from real visitors. If a bot fills it, the
            server silently fake-succeeds and never stores the row. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website-demo_page">Website</label>
          <input id="website-demo_page" tabIndex={-1} autoComplete="off" {...form.register("website")} />
        </div>

        {/* Politely announced so screen-reader users hear the outcome without focus tricks. */}
        <div role="status" aria-live="polite" className="sr-only">
          {submitting ? "Sending your request…" : ""}
        </div>
        {failed && (
          <p className="text-sm text-destructive" role="alert" data-testid="text-lead-error">
            {failed}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="w-full" data-testid="button-submit-lead">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send request <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Your request is saved only after a success confirmation. No spam — we&apos;ll only reach out
          about HarborIQ early access. See our{" "}
          <Link href="/privacy" className="underline underline-offset-4" data-testid="link-form-privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}

function StepTwo({ leadId, onFinish }: { leadId: number | null; onFinish: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  const form = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      phone: "",
      businessType: undefined,
      fleetOrJobs: "",
      currentSoftware: "",
      biggestPain: "",
      heardAbout: "",
      preferredContact: undefined,
    },
  });

  async function onSubmit(values: StepTwoValues) {
    // Step 1 already created the lead, so an enrichment failure never loses it.
    if (leadId == null) {
      onFinish();
      return;
    }
    setFailed(false);
    setSubmitting(true);
    try {
      await apiRequest("POST", `/api/leads/${leadId}/enrich`, values);
      track("form_complete", { form: SOURCE, step: 2 });
      onFinish();
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        data-testid="form-lead-enrich"
        noValidate
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">Help us tailor your demo (30 seconds)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your request is already in — these are optional, and they let us skip straight to the parts
            of HarborIQ that matter to you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(941) 555-0134" {...field} data-testid="input-phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of business</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-business-type">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mobile_mechanic">Mobile marine mechanic</SelectItem>
                    <SelectItem value="boatyard">Boatyard</SelectItem>
                    <SelectItem value="marina">Marina</SelectItem>
                    <SelectItem value="dealer">Dealer</SelectItem>
                    <SelectItem value="other">Something else</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fleetOrJobs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rough volume</FormLabel>
              <FormControl>
                <Input placeholder="40 jobs/week, or 120 slips" {...field} data-testid="input-fleet-or-jobs" />
              </FormControl>
              <FormDescription>Jobs per week, boats under management, or slip count — whatever fits.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentSoftware"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you using today?</FormLabel>
              <FormControl>
                <Input placeholder="QuickBooks + a paper board" {...field} data-testid="input-current-software" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="biggestPain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biggest headache right now</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Invoices go out a week late and I lose track of which jobs are done."
                  {...field}
                  data-testid="input-biggest-pain"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="heardAbout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <FormControl>
                  <Input placeholder="A tech at my marina" {...field} data-testid="input-heard-about" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Best way to reach you</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-preferred-contact">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone call</SelectItem>
                    <SelectItem value="text">Text message</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {submitting ? "Saving your details…" : ""}
        </div>
        {failed && (
          <p className="text-sm text-destructive" role="alert" data-testid="text-enrich-error">
            We couldn't save those extra details — but your request is already in, so we'll still reach out.
          </p>
        )}

        <div className="flex flex-col gap-2 pb-2 sm:flex-row">
          <Button type="submit" size="lg" disabled={submitting} className="sm:flex-1" data-testid="button-submit-enrich">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
              </>
            ) : (
              "Finish"
            )}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={onFinish}
            data-testid="button-skip-enrich"
          >
            Skip for now
          </Button>
        </div>
      </form>
    </Form>
  );
}
