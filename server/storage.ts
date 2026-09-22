import { leads } from "@shared/schema";
import type { Lead, InsertLead, MarketingLeadEnrich } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { desc, eq, and, gte } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    team_size TEXT NOT NULL,
    source TEXT NOT NULL,
    created_at TEXT NOT NULL,
    notified_at TEXT
  );
`);

// Additive migration: optional discovery columns. Existing rows keep NULLs and the
// four required columns are untouched, so the public API stays backward-compatible.
const existingColumns = new Set(
  (sqlite.prepare("PRAGMA table_info(leads)").all() as { name: string }[]).map((c) => c.name)
);
const optionalColumns = [
  "phone",
  "business_type",
  "fleet_or_jobs",
  "current_software",
  "biggest_pain",
  "heard_about",
  "preferred_contact",
  "enriched_at",
];
for (const col of optionalColumns) {
  if (!existingColumns.has(col)) {
    sqlite.exec(`ALTER TABLE leads ADD COLUMN ${col} TEXT;`);
  }
}

export const db = drizzle(sqlite);

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  findRecentByEmail(email: string, sinceIso: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  enrichLead(id: number, patch: MarketingLeadEnrich): Promise<Lead | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createLead(lead: InsertLead): Promise<Lead> {
    return db
      .insert(leads)
      .values({ ...lead, createdAt: new Date().toISOString() })
      .returning()
      .get();
  }

  async findRecentByEmail(email: string, sinceIso: string): Promise<Lead | undefined> {
    return db
      .select()
      .from(leads)
      .where(and(eq(leads.email, email), gte(leads.createdAt, sinceIso)))
      .orderBy(desc(leads.createdAt))
      .get();
  }

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt)).all();
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return db.select().from(leads).where(eq(leads.id, id)).get();
  }

  /** Adds Step 2 discovery answers to an existing lead. Only defined keys are written. */
  async enrichLead(id: number, patch: MarketingLeadEnrich): Promise<Lead | undefined> {
    const values: Record<string, string | null> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      values[key] = value === "" ? null : (value as string | null);
    }
    if (Object.keys(values).length === 0) return this.getLead(id);

    return db
      .update(leads)
      .set({ ...values, enrichedAt: new Date().toISOString() })
      .where(eq(leads.id, id))
      .returning()
      .get();
  }
}

export const storage = new DatabaseStorage();
