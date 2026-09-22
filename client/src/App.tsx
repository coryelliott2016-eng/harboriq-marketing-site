import { Suspense, lazy, useEffect } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Features from "@/pages/features";
import MobileMechanics from "@/pages/solutions/mobile-mechanics";
import Boatyards from "@/pages/solutions/boatyards";
import Marinas from "@/pages/solutions/marinas";
import Security from "@/pages/security";
import Pricing from "@/pages/pricing";
import ReleaseLog from "@/pages/resources/release-log";
import FAQ from "@/pages/resources/faq";
import About from "@/pages/about";
import Demo from "@/pages/demo";

/**
 * Route-level code splitting for the heaviest, least-visited pages.
 * /team pulls in recharts and /investors is a long-form page — neither belongs
 * in the bundle a first-time marketing visitor downloads.
 */
const Team = lazy(() => import("@/pages/team"));
const Investors = lazy(() => import("@/pages/investors"));
const Privacy = lazy(() => import("@/pages/legal/privacy"));
const Terms = lazy(() => import("@/pages/legal/terms"));
const Cookies = lazy(() => import("@/pages/legal/cookies"));

function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-4"
      role="status"
      aria-live="polite"
      data-testid="status-route-loading"
    >
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/features" component={Features} />
      <Route path="/solutions/mobile-mechanics" component={MobileMechanics} />
      <Route path="/solutions/boatyards" component={Boatyards} />
      <Route path="/solutions/marinas" component={Marinas} />
      <Route path="/security" component={Security} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/resources/release-log" component={ReleaseLog} />
      <Route path="/resources/faq" component={FAQ} />
      <Route path="/about" component={About} />
      <Route path="/demo" component={Demo} />
      <Route path="/investors" component={Investors} />
      <Route path="/team" component={Team} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={useHashLocation}>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <AppRouter />
          </Suspense>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
