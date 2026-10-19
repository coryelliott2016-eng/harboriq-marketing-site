import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { commandTargets } from "@/lib/site-config";
import { Compass } from "lucide-react";

const groupOrder = [
  "Pages",
  "Solutions",
  "Resources",
  "Home sections",
  "Pricing sections",
  "Investor sections",
  "Legal",
  "Other",
];

/**
 * Any group added to `commandTargets` but missing from `groupOrder` still renders,
 * appended after the known groups — so a new destination can never silently
 * disappear from the palette (which is how the Legal pages were first missed).
 */
function orderedGroups(groups: string[]): string[] {
  const known = groupOrder.filter((g) => groups.includes(g));
  const extra = groups.filter((g) => !groupOrder.includes(g));
  return [...known, ...extra];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback(
    (href: string) => {
      setOpen(false);
      if (href.includes("#")) {
        const [path, hash] = href.split("#");
        const targetPath = path || "/";
        if (window.location.pathname === targetPath) {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        } else {
          navigate(targetPath);
          setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 150);
        }
      } else {
        navigate(href);
        window.scrollTo({ top: 0 });
      }
    },
    [navigate]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a page or section…" data-testid="input-command-search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {orderedGroups(Array.from(new Set(commandTargets.map((t) => t.group)))).map((group) => {
          const items = commandTargets.filter((t) => t.group === group);
          if (items.length === 0) return null;
          return (
            <CommandGroup heading={group} key={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.keywords ?? ""}`}
                  onSelect={() => runCommand(item.href)}
                  data-testid={`command-item-${item.href.replace(/[/#]/g, "-")}`}
                >
                  <Compass className="mr-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
