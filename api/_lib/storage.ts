/**
 * Durable marketing lead storage on Neon using its parameterized HTTP driver.
 * The client is lazy so missing configuration does not break module imports.
 * Schema is provisioned by migrations/001_marketing_leads.sql, NOT by requests.
 * Runtime credentials have limited table grants and cannot create/drop tables.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { Lead, MarketingLeadEnrich } from "./schema.js";

type SqlClient = NeonQueryFunction<false, false>;

let sqlClient: SqlClient | null = null;

export function isPersistenceConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING
  );
}

function getSql(): SqlClient {
  if (sqlClient) return sqlClient;
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Provision Vercel Postgres and expose POSTGRES_URL to this project."
    );
  }
  sqlClient = neon(url) as SqlClient;
  return sqlClient;
}

export async function checkLeadStorage(): Promise<boolean> {
  if (!isPersistenceConfigured()) return false;
  // Fail closed until provisioning/migrations have prepared the lead table.
  const sql = getSql();
  await sql`SELECT id FROM leads LIMIT 0`;
  return true;
}

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: Number(row.id),
    fullName: String(row.full_name),
    businessName: String(row.business_name),
    email: String(row.email),
    teamSize: String(row.team_size),
    source: String(row.source),
    createdAt: new Date(row.created_at as string).toISOString(),
    notifiedAt: row.notified_at ? new Date(row.notified_at as string).toISOString() : null,
    phone: (row.phone as string | null) ?? null,
    businessType: (row.business_type as string | null) ?? null,
    fleetOrJobs: (row.fleet_or_jobs as string | null) ?? null,
    currentSoftware: (row.current_software as string | null) ?? null,
    biggestPain: (row.biggest_pain as string | null) ?? null,
    heardAbout: (row.heard_about as string | null) ?? null,
    preferredContact: (row.preferred_contact as string | null) ?? null,
    enrichedAt: row.enriched_at ? new Date(row.enriched_at as string).toISOString() : null,
  };
}

export interface LeadInsert {
  fullName: string;
  businessName: string;
  email: string;
  teamSize: string;
  source: string;
  phone?: string | null;
  businessType?: string | null;
  fleetOrJobs?: string | null;
  currentSoftware?: string | null;
  biggestPain?: string | null;
  heardAbout?: string | null;
  preferredContact?: string | null;
}

export async function createLead(lead: LeadInsert): Promise<Lead> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO leads (
      full_name, business_name, email, team_size, source,
      phone, business_type, fleet_or_jobs, current_software,
      biggest_pain, heard_about, preferred_contact
    )
    VALUES (
      ${lead.fullName}, ${lead.businessName}, ${lead.email}, ${lead.teamSize}, ${lead.source},
      ${lead.phone ?? null}, ${lead.businessType ?? null}, ${lead.fleetOrJobs ?? null},
      ${lead.currentSoftware ?? null}, ${lead.biggestPain ?? null}, ${lead.heardAbout ?? null},
      ${lead.preferredContact ?? null}
    )
    RETURNING *
  `;
  return rowToLead(rows[0] as Record<string, unknown>);
}

export async function findRecentByEmail(
  email: string,
  sinceIso: string
): Promise<Lead | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM leads
    WHERE email = ${email} AND created_at >= ${sinceIso}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return rows.length ? rowToLead(rows[0] as Record<string, unknown>) : undefined;
}

export async function getAllLeads(): Promise<Lead[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 500`;
  return rows.map((r) => rowToLead(r as Record<string, unknown>));
}

export async function getLead(id: number): Promise<Lead | undefined> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToLead(rows[0] as Record<string, unknown>) : undefined;
}

/**
 * Adds the optional Step-2 discovery answers to an existing lead. Only defined
 * keys are written; empty strings are normalized to NULL to match the create
 * contract's semantics.
 */
export async function enrichLead(
  id: number,
  patch: MarketingLeadEnrich
): Promise<Lead | undefined> {
  const sql = getSql();

  const columns: Record<string, string | null> = {};
  const map: Array<[keyof MarketingLeadEnrich, string]> = [
    ["phone", "phone"],
    ["businessType", "business_type"],
    ["fleetOrJobs", "fleet_or_jobs"],
    ["currentSoftware", "current_software"],
    ["biggestPain", "biggest_pain"],
    ["heardAbout", "heard_about"],
    ["preferredContact", "preferred_contact"],
  ];
  for (const [srcKey, dbCol] of map) {
    const value = patch[srcKey];
    if (value === undefined) continue;
    columns[dbCol] = value === "" ? null : (value as string | null);
  }

  if (Object.keys(columns).length === 0) {
    return getLead(id);
  }

  // neon() doesn't support tagged fragments for dynamic column lists, so we
  // build the SET clause with an unsafe identifier list — every column name
  // above is a hard-coded literal, so no injection surface exists.
  const setClauses = Object.keys(columns).map((c, i) => `${c} = $${i + 1}`);
  setClauses.push(`enriched_at = NOW()`);
  const values = Object.values(columns);
  const rows = await sql.query(
    `UPDATE leads SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows.length ? rowToLead(rows[0] as Record<string, unknown>) : undefined;
}
