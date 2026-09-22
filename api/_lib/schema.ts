/**
 * Validation contracts for the Vercel serverless API surface.
 *
 * This is a self-contained copy of the fields the marketing site needs — the
 * shared `@shared/schema` module also imports drizzle-orm/sqlite-core, which
 * has no place in a serverless function. Keep both files in sync when the
 * lead-capture contract changes.
 */
import { z } from "zod";

export const teamSizeValues = ["solo", "team", "business", "enterprise"] as const;
export const businessTypeValues = [
  "mobile_mechanic",
  "boatyard",
  "marina",
  "dealer",
  "other",
] as const;
export const preferredContactValues = ["email", "phone", "text"] as const;

const optionalLeadFields = {
  phone: z.string().trim().max(40).optional().nullable(),
  businessType: z.enum(businessTypeValues).optional().nullable(),
  fleetOrJobs: z.string().trim().max(200).optional().nullable(),
  currentSoftware: z.string().trim().max(200).optional().nullable(),
  biggestPain: z.string().trim().max(2000).optional().nullable(),
  heardAbout: z.string().trim().max(200).optional().nullable(),
  preferredContact: z.enum(preferredContactValues).optional().nullable(),
};

export const marketingLeadCreateSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  businessName: z.string().trim().min(1, "Business name is required").max(200),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(320),
  teamSize: z.enum(teamSizeValues),
  source: z.string().trim().min(1).max(120),
  website: z.string().max(200).optional().default(""),
  ...optionalLeadFields,
});

export const marketingLeadEnrichSchema = z.object(optionalLeadFields);

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

export type MarketingLeadCreate = z.infer<typeof marketingLeadCreateSchema>;
export type MarketingLeadEnrich = z.infer<typeof marketingLeadEnrichSchema>;

export interface Lead {
  id: number;
  fullName: string;
  businessName: string;
  email: string;
  teamSize: string;
  source: string;
  createdAt: string;
  notifiedAt: string | null;
  phone: string | null;
  businessType: string | null;
  fleetOrJobs: string | null;
  currentSoftware: string | null;
  biggestPain: string | null;
  heardAbout: string | null;
  preferredContact: string | null;
  enrichedAt: string | null;
}
