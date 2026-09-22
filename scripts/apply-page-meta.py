#!/usr/bin/env python3
"""One-off codemod: inject usePageMeta(...) into every page component."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "client/src/pages"

PAGES = {
    "home.tsx": ("Home", None, "/", "HarborIQ is the operating system for marine service businesses: CRM, AI-assisted dispatch, Stripe invoicing, marina slip management, an offline field app, and a customer portal."),
    "features.tsx": ("Features", "Features", "/features", "Every HarborIQ capability in one place: marine CRM, AI-assisted dispatch, Stripe invoicing and Connect payouts, slip and mooring management, the offline field app, and the customer portal."),
    "security.tsx": ("Security", "Security", "/security", "HarborIQ's security posture: Zero Trust architecture, an OWASP ASVS Level 3 target, PostgreSQL row-level security for tenant isolation, MFA, audit logging, and encryption in transit and at rest."),
    "pricing.tsx": ("Pricing", "Pricing", "/pricing", "Draft HarborIQ pricing: Solo $79, Team $199, Business $399 per month, and custom Enterprise plans. Pricing is a framework and subject to change before general availability."),
    "about.tsx": ("About", "About", "/about", "HarborIQ was built by Cory Elliott, an ABYC-certified marine technician behind Off the Hook Marine Specialist in Sarasota, Florida — software written from inside the trade."),
    "demo.tsx": ("Demo", "Get a Demo", "/demo", "Request a HarborIQ demo tailored to your operation — dispatch, invoicing, slip management, or the offline field app. A 20–30 minute walkthrough, no commitment required."),
    "investors.tsx": ("Investors", "Investors", "/investors", "HarborIQ is raising a seed round. Review the market thesis, product status, and architecture, then request investor materials from Cory@HarborIQ.com."),
    "team.tsx": ("Team", "Team Dashboard", "/team", "Internal HarborIQ leads dashboard — admin token required."),
    "not-found.tsx": ("NotFound", "Page Not Found", None, "That page doesn't exist. Head back to the HarborIQ home page to keep exploring the marine service operating system."),
    "resources/faq.tsx": ("FAQ", "FAQ", "/resources/faq", "Answers to the questions evaluators ask most about HarborIQ: who it's for, what ships today, how security works, pricing, and data migration."),
    "resources/release-log.tsx": ("ReleaseLog", "Release Log", "/resources/release-log", "All 17 shipped HarborIQ build phases in plain English, from multi-tenant foundations through AI workflows, Stripe billing, and the customer portal."),
    "solutions/mobile-mechanics.tsx": ("MobileMechanics", "For Mobile Marine Mechanics", "/solutions/mobile-mechanics", "Dispatch, invoice, and get paid from the dock or the driveway. HarborIQ gives mobile marine mechanics a CRM, scheduling, Stripe invoicing, and an offline field app."),
    "solutions/boatyards.tsx": ("Boatyards", "For Boatyards", "/solutions/boatyards", "Track haul-outs, storage, and multi-technician jobs in one board. HarborIQ gives boatyards scheduling, job costing, invoicing, and a customer portal."),
    "solutions/marinas.tsx": ("Marinas", "For Marinas", "/solutions/marinas", "Slip, mooring, and dry-stack assignments with double-booking prevention, tenant billing through Stripe, and a customer portal — all in one marina system."),
}


def literal(v):
    return "undefined" if v is None else '"' + v.replace('"', '\\"') + '"'


for rel, (fn, title, path, desc) in PAGES.items():
    p = ROOT / rel
    src = p.read_text()
    if "usePageMeta" in src:
        print("skip", rel)
        continue

    depth = rel.count("/")
    src = 'import { usePageMeta } from "@/hooks/use-page-meta";\n' + src

    args = []
    if title:
        args.append(f"    title: {literal(title)},")
    args.append(f"    description: {literal(desc)},")
    if path:
        args.append(f"    path: {literal(path)},")
    call = "  usePageMeta({\n" + "\n".join(args) + "\n  });\n\n"

    pattern = re.compile(r"(export default function " + fn + r"\(\) \{\n)")
    new, n = pattern.subn(lambda m: m.group(1) + call, src, count=1)
    if n != 1:
        raise SystemExit(f"could not patch {rel}")
    p.write_text(new)
    print("patched", rel)
