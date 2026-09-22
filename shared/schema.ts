import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamSizeValues = ["solo", "team", "business", "enterprise"] as const;
export type TeamSize = (typeof teamSizeValues)[number];

export const businessTypeValues = [
  "mobile_mechanic",
  "boatyard",
  "marina",
  "dealer",
  "other",
] as const;
export type BusinessType = (typeof businessTypeValues)[number];

export const preferredContactValues = ["email", "phone", "text"] as const;
export type PreferredContact = (typeof preferredContactValues)[number];

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // --- Required core fields (unchanged, keeps the API backward-compatible) ---
  fullName: text("full_name").notNull(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull(),
  teamSize: text("team_size").notNull(),
  source: text("source").notNull(),
  createdAt: text("created_at").notNull(),
  notifiedAt: text("notified_at"),
  // --- Optional discovery/enrichment fields (Step 2 of the demo form) ---
  phone: text("phone"),
  businessType: text("business_type"),
  fleetOrJobs: text("fleet_or_jobs"),
  currentSoftware: text("current_software"),
  biggestPain: text("biggest_pain"),
  heardAbout: text("heard_about"),
  preferredContact: text("preferred_contact"),
  enrichedAt: text("enriched_at"),
});

// Base insert schema from the table (omits autoincrement id + server-set fields)
const baseLeadInsertSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  notifiedAt: true,
  enrichedAt: true,
});

/** Optional discovery fields, shared by the create + enrich contracts. */
const optionalLeadFields = {
  phone: z.string().trim().max(40).optional().nullable(),
  businessType: z.enum(businessTypeValues).optional().nullable(),
  fleetOrJobs: z.string().trim().max(200).optional().nullable(),
  currentSoftware: z.string().trim().max(200).optional().nullable(),
  biggestPain: z.string().trim().max(2000).optional().nullable(),
  heardAbout: z.string().trim().max(200).optional().nullable(),
  preferredContact: z.enum(preferredContactValues).optional().nullable(),
};

// Public-facing lead submission contract (MarketingLeadCreate).
// `website` is an anti-spam honeypot: real visitors never see or fill it because
// it's visually hidden; if a bot fills it, we silently fake-succeed and never store it.
// All discovery fields are optional, so existing clients that only send the four
// required fields keep working unchanged.
export const marketingLeadCreateSchema = baseLeadInsertSchema.extend({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  businessName: z.string().trim().min(1, "Business name is required").max(200),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(320),
  teamSize: z.enum(teamSizeValues),
  source: z.string().trim().min(1).max(120),
  website: z.string().max(200).optional().default(""),
  ...optionalLeadFields,
});

/** POST /api/leads/:id/enrich — adds Step 2 discovery answers to an existing lead. */
export const marketingLeadEnrichSchema = z.object(optionalLeadFields);

export type MarketingLeadCreate = z.infer<typeof marketingLeadCreateSchema>;
export type MarketingLeadEnrich = z.infer<typeof marketingLeadEnrichSchema>;
export type InsertLead = z.infer<typeof baseLeadInsertSchema>;
export type Lead = typeof leads.$inferSelect;

export const leadResponseSchema = z.object({
  ok: z.boolean(),
  id: z.number().nullable(),
  duplicate: z.boolean(),
  message: z.string(),
});
export type LeadResponse = z.infer<typeof leadResponseSchema>;

/** POST /api/chat — AI inquiry assistant contract. */
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  ok: z.boolean(),
  reply: z.string(),
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;
