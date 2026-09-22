export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Investors", href: "/investors" },
];

export const solutionsNav: NavLink[] = [
  {
    label: "Mobile Marine Mechanics",
    href: "/solutions/mobile-mechanics",
    description: "Dispatch, invoice, and get paid from the dock or the driveway.",
  },
  {
    label: "Boatyards",
    href: "/solutions/boatyards",
    description: "Track haul-outs, storage, and multi-tech jobs in one board.",
  },
  {
    label: "Marinas",
    href: "/solutions/marinas",
    description: "Slip assignments, billing, and tenant communication together.",
  },
];

export const resourcesNav: NavLink[] = [
  { label: "Release Log", href: "/resources/release-log", description: "Phases 1–17, in plain English." },
  { label: "FAQ", href: "/resources/faq", description: "Common questions from evaluators." },
];

export const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security & Compliance", href: "/security" },
    { label: "Get a Demo", href: "/demo" },
  ],
  solutions: solutionsNav,
  resources: resourcesNav,
  company: [
    { label: "About", href: "/about" },
    { label: "Investors", href: "/investors" },
    { label: "Team login", href: "/team" },
  ],
  // Legal lives in the footer only — never in the primary nav.
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

// All jump targets for the ⌘K command palette: full pages plus in-page sections.
export interface CommandTarget {
  group: string;
  label: string;
  href: string;
  keywords?: string;
}

export const commandTargets: CommandTarget[] = [
  { group: "Pages", label: "Home", href: "/" },
  { group: "Pages", label: "Features", href: "/features" },
  { group: "Pages", label: "Security & Compliance", href: "/security" },
  { group: "Pages", label: "Pricing", href: "/pricing" },
  { group: "Pages", label: "About", href: "/about" },
  { group: "Pages", label: "Get a Demo", href: "/demo" },
  { group: "Pages", label: "Investors", href: "/investors", keywords: "safe seed round raise valuation cap deck fundraising" },
  { group: "Solutions", label: "Mobile Marine Mechanics", href: "/solutions/mobile-mechanics" },
  { group: "Solutions", label: "Boatyards", href: "/solutions/boatyards" },
  { group: "Solutions", label: "Marinas", href: "/solutions/marinas" },
  { group: "Resources", label: "Release Log", href: "/resources/release-log" },
  { group: "Resources", label: "FAQ", href: "/resources/faq" },
  { group: "Home sections", label: "ROI Calculator", href: "/#roi-calculator", keywords: "estimate savings hours revenue" },
  { group: "Home sections", label: "Feature Pillars", href: "/#feature-pillars", keywords: "crm dispatch invoicing" },
  { group: "Home sections", label: "Security Callout", href: "/#security-callout", keywords: "zero trust owasp" },
  { group: "Pricing sections", label: "Plan Comparison Table", href: "/pricing#comparison", keywords: "compare tiers table" },
  { group: "Investor sections", label: "Round Details", href: "/investors#round-terms", keywords: "seed round investor materials deck" },
  { group: "Investor sections", label: "Market Sizing Note", href: "/investors#market", keywords: "tam sam confidence" },
  { group: "Investor sections", label: "Request the Deck", href: "/investors#request-deck", keywords: "investor deck contact cory" },
  { group: "Home sections", label: "Product Preview Tour", href: "/#product-tour", keywords: "screenshots dashboard dispatch mockup demo interface" },
  { group: "Home sections", label: "How Onboarding Works", href: "/#how-it-works", keywords: "onboarding migration import setup" },
  { group: "Legal", label: "Privacy Policy", href: "/privacy", keywords: "gdpr ccpa data personal information" },
  { group: "Legal", label: "Terms of Service", href: "/terms", keywords: "terms conditions liability governing law" },
  { group: "Legal", label: "Cookie Policy", href: "/cookies", keywords: "cookies tracking analytics consent" },
  { group: "Other", label: "Team Dashboard (admin)", href: "/team", keywords: "leads admin login" },
];

export const teamSizeLabels: Record<string, string> = {
  solo: "Solo",
  team: "Team",
  business: "Business",
  enterprise: "Enterprise",
};

export const businessTypeLabels: Record<string, string> = {
  mobile_mechanic: "Mobile mechanic",
  boatyard: "Boatyard",
  marina: "Marina",
  dealer: "Dealer",
  other: "Other",
};

export const preferredContactLabels: Record<string, string> = {
  email: "Email",
  phone: "Phone call",
  text: "Text message",
};

export const pricingTiers: {
  id: string;
  name: string;
  monthly: number | null;
  positioning: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: "solo",
    name: "Solo",
    monthly: 79,
    positioning: "1 tech, core CRM + invoicing + Stripe",
    features: [
      "Customer CRM & job history",
      "Invoicing with Stripe payments",
      "Basic scheduling",
      "Customer portal (read-only)",
    ],
  },
  {
    id: "team",
    name: "Team",
    monthly: 199,
    positioning: "Up to ~10 users, AI dispatch, offline field app",
    features: [
      "Everything in Solo",
      "AI-assisted job dispatch & scoring",
      "Offline PWA field app",
      "Team scheduling & job assignment",
      "Customer portal (interactive)",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    monthly: 399,
    positioning: "Marina/slip management, accounting/reporting, portal",
    features: [
      "Everything in Team",
      "Marina & slip management",
      "Accounting & reporting exports",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    positioning: "SSO/advanced RBAC, dedicated support, custom SLAs",
    features: [
      "Everything in Business",
      "SSO & advanced RBAC",
      "Dedicated onboarding & support",
      "Custom SLAs",
    ],
  },
];
