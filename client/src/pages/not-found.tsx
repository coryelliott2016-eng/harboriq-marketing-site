import { usePageMeta } from "@/hooks/use-page-meta";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Compass } from "lucide-react";

export default function NotFound() {
  usePageMeta({
    title: "Page Not Found",
    description:
      "That page doesn't exist. Head back to the HarborIQ home page to keep exploring the marine service operating system.",
  });

  return (
    <SiteLayout>
      <section className="bg-brand-900 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <Compass className="mx-auto h-10 w-10 text-amber-400" aria-hidden="true" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-amber-400">Error 404</p>
          <h1 className="mt-3 text-xl font-display font-bold text-white">
            That page has slipped its mooring
          </h1>
          <p className="mt-4 text-base text-white/70">
            The page you're looking for doesn't exist or has moved. Try the product tour, pricing, or
            book a walkthrough of HarborIQ.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" data-testid="link-404-home">
              <Link href="/">Back to the home page</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
              data-testid="link-404-demo"
            >
              <Link href="/demo">Get a demo of HarborIQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
