import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";
import { primaryNav, solutionsNav, resourcesNav } from "@/lib/site-config";
import { ChevronDown, Menu, Command } from "lucide-react";

function isActivePath(current: string, href: string) {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href + "/");
}

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={`on-dark sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? "bg-brand-900/95 backdrop-blur supports-[backdrop-filter]:bg-brand-900/85 border-white/10"
          : "bg-brand-900 border-white/5"
      }`}
      data-testid="site-header"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" data-testid="link-logo-home">
          <Logo className="[&_span]:text-white" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          <NavAnchor href="/" label="Home" active={isActivePath(location, "/")} />
          <NavAnchor href="/features" label="Features" active={isActivePath(location, "/features")} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                data-testid="button-nav-solutions"
              >
                Solutions <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {solutionsNav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} data-testid={`link-nav-${item.href}`} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NavAnchor href="/security" label="Security" active={isActivePath(location, "/security")} />
          <NavAnchor href="/pricing" label="Pricing" active={isActivePath(location, "/pricing")} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                data-testid="button-nav-resources"
              >
                Resources <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {resourcesNav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} data-testid={`link-nav-${item.href}`} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NavAnchor href="/about" label="About" active={isActivePath(location, "/about")} />
          <NavAnchor href="/investors" label="Investors" active={isActivePath(location, "/investors")} />
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="hidden min-h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white xl:inline-flex"
            aria-label="Open command palette"
            data-testid="button-command-hint"
          >
            <Command className="h-3 w-3" aria-hidden="true" />
            <span>Press</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>
          </button>

          <Button asChild size="sm" className="hidden sm:inline-flex" data-testid="button-nav-demo">
            <Link href="/demo">Get a Demo</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white/80 hover:bg-white/10 lg:hidden"
                aria-label="Open menu"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-brand-900 border-white/10 text-white overflow-y-auto">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavAnchor({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors ${
        active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
      data-testid={`link-nav-${href}`}
    >
      {label}
    </Link>
  );
}

function MobileNav() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <Logo className="[&_span]:text-white" />
      <nav className="flex flex-col gap-1" aria-label="Mobile">
        {primaryNav.slice(0, 2).map((item) => (
          <MobileLink key={item.href} href={item.href} label={item.label} />
        ))}
        <MobileSectionLabel label="Solutions" />
        {solutionsNav.map((item) => (
          <MobileLink key={item.href} href={item.href} label={item.label} indent />
        ))}
        {primaryNav.slice(2).map((item) => (
          <MobileLink key={item.href} href={item.href} label={item.label} />
        ))}
        <MobileSectionLabel label="Resources" />
        {resourcesNav.map((item) => (
          <MobileLink key={item.href} href={item.href} label={item.label} indent />
        ))}
      </nav>
      <SheetClose asChild>
        <Button asChild size="lg" className="w-full" data-testid="button-mobile-demo">
          <Link href="/demo">Get a Demo</Link>
        </Button>
      </SheetClose>
    </div>
  );
}

function MobileSectionLabel({ label }: { label: string }) {
  return <div className="mt-3 px-3 text-xs font-medium uppercase tracking-wide text-white/60">{label}</div>;
}

function MobileLink({ href, label, indent }: { href: string; label: string; indent?: boolean }) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={`flex min-h-11 items-center rounded-md px-3 text-base text-white/85 hover:bg-white/10 hover:text-white ${indent ? "ml-2" : ""}`}
        data-testid={`link-mobile-${href}`}
      >
        {label}
      </Link>
    </SheetClose>
  );
}
