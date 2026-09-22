import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import { apiRequest, leadSubmissionError } from "@/lib/queryClient";
import { LeadAvailabilityGate } from "./lead-availability";
import { track } from "@/lib/analytics";
import { teamSizeValues, type LeadResponse } from "@shared/schema";
import { CheckCircle2, Loader2 } from "lucide-react";

const leadFormSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name"),
  businessName: z.string().trim().min(1, "Enter your business name"),
  email: z.string().trim().email("Enter a valid email address"),
  teamSize: z.enum(teamSizeValues, { message: "Select a team size" }),
  website: z.string(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  source: string;
  compact?: boolean;
  title?: string;
  description?: string;
  /** Pre-set the team size. Combine with `hideTeamSize` for non-buyer forms (e.g. investors). */
  defaultTeamSize?: LeadFormValues["teamSize"];
  /** Hide the team-size selector and submit the `defaultTeamSize` value instead. */
  hideTeamSize?: boolean;
  submitLabel?: string;
  footnote?: string;
  businessLabel?: string;
  businessPlaceholder?: string;
}

export function LeadForm(props: LeadFormProps) {
  return <LeadAvailabilityGate><AvailableLeadForm {...props} /></LeadAvailabilityGate>;
}

function AvailableLeadForm({
  source,
  compact = false,
  title,
  description,
  defaultTeamSize,
  hideTeamSize = false,
  submitLabel = "Request access",
  footnote = "No spam. We'll only reach out about your HarborIQ trial.",
  businessLabel = "Business name",
  businessPlaceholder = "Rivera Marine Services",
}: LeadFormProps) {
  const [result, setResult] = useState<LeadResponse | null>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      teamSize: (defaultTeamSize ?? undefined) as unknown as LeadFormValues["teamSize"],
      website: "" as string,
    },
  });

  const started = useRef(false);

  /** One form_start per mounted form, on the visitor's first interaction. */
  function noteStart() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form: source });
  }

  const mutation = useMutation({
    mutationFn: async (values: LeadFormValues) => {
      const res = await apiRequest("POST", "/api/leads", { ...values, source });
      return (await res.json()) as LeadResponse;
    },
    onSuccess: (data) => {
      track("form_complete", { form: source, duplicate: Boolean(data.duplicate) });
      setResult(data);
      form.reset();
    },
  });

  if (result?.ok) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-lg border border-teal-500/30 bg-teal-50 dark:bg-teal-950/20 px-6 py-10 text-center"
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        onFocusCapture={noteStart}
        onChangeCapture={noteStart}
        className="flex flex-col gap-4"
        data-testid={`form-lead-${source}`}
        noValidate
      >
        {(title || description) && (
          <div className="mb-1">
            {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        )}

        <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
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
                <FormLabel>{businessLabel}</FormLabel>
                <FormControl>
                  <Input autoComplete="organization" placeholder={businessPlaceholder} {...field} data-testid="input-business-name" />
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
            <FormItem className={hideTeamSize ? "hidden" : undefined}>
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

        {/* Honeypot: visually hidden from real visitors, never read by them.
            If a bot fills it, the server silently fake-succeeds and never stores it. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`website-${source}`}>Website</label>
          <input
            id={`website-${source}`}
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {mutation.isPending ? "Sending your request…" : ""}
        </div>
        {mutation.isError && (
          <p className="text-sm text-destructive" role="alert" data-testid="text-lead-error">
            {leadSubmissionError(mutation.error)}
          </p>
        )}

        <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full" data-testid="button-submit-lead">
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">{footnote}</p>
      </form>
    </Form>
  );
}
