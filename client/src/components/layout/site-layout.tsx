import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CommandPalette } from "./command-palette";
import { ChatAssistant } from "@/components/site/chat-assistant";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/*
        Hash routing owns location.hash, so a real `href="#main-content"` would
        navigate the SPA to a bogus route. Use a button that moves focus instead —
        same WCAG 2.4.1 bypass mechanism, no router side effects.
      */}
      <button
        type="button"
        onClick={() => {
          const main = document.getElementById("main-content");
          if (!main) return;
          main.focus({ preventScroll: false });
          main.scrollIntoView({ block: "start" });
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:min-h-11 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        data-testid="button-skip-to-content"
      >
        Skip to main content
      </button>
      <SiteHeader />
      <CommandPalette />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      <ChatAssistant />
    </div>
  );
}
