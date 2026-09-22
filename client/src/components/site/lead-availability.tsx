import { useId, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

export function LeadAvailabilityGate({ children }: { children: ReactNode }) {
  const headingId = useId();
  const status = useQuery({
    queryKey: ["lead-availability"],
    queryFn: async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await apiRequest("GET", "/api/lead-status", undefined, undefined, controller.signal);
        return (await response.json()) as { available: boolean };
      } finally {
        window.clearTimeout(timeout);
      }
    },
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (status.isPending) {
    return <p role="status" className="py-6 text-sm text-muted-foreground">Checking online request availability…</p>;
  }
  if (status.data?.available === true) return <>{children}</>;

  return (
    <section
      className="rounded-lg border border-border bg-background p-5 text-foreground"
      data-testid="lead-unavailable"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="text-lg font-semibold">
        Online requests are temporarily unavailable
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        We cannot save an online request right now. Please call to discuss a demo or early access.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <Button asChild size="lg">
          <a href="tel:+19412101663">Call 941-210-1663</a>
        </Button>
        <Button type="button" variant="outline" disabled={status.isFetching} onClick={() => void status.refetch()}>
          {status.isFetching ? "Checking…" : "Check again"}
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        No request has been submitted. Please do not send identification numbers or financial details.
      </p>
    </section>
  );
}
