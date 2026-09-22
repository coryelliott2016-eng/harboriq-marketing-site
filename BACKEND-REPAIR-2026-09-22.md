# HarborIQ Backend Repair and Remaining Launch Blockers

Updated September 22, 2026 after Neon connection. The marketing-site runtime and lead capture are repaired and verified on the Vercel domain. AI chat and the primary domain remain blocked. This work does not certify readiness of the separate FastAPI marine-service platform.

## Deployment record

- **Project:** `harboriq`, team `harbor-iq`, project ID `prj_0MlU2GBOn2eX8i9fEoFljEYs9uez`.
- **Previous production deployment:** `dpl_1TCq7ryZdUWLsyixDDkv6yAh6mR9`.
- **Repaired deployment:** `dpl_2rSY9TYppJ6evBUoyD3Zw4RZG9gR`, [deployment details](https://vercel.com/harbor-iq/harboriq/2rSY9TYppJ6evBUoyD3Zw4RZG9gR).
- **Current database-backed production deployment:** `dpl_C8R6WkqeuRAJjmV5t1fhRCXGSZXL`, [deployment details](https://vercel.com/harbor-iq/harboriq/C8R6WkqeuRAJjmV5t1fhRCXGSZXL).
- **Database:** [harboriq-marketing in Neon](https://console.neon.tech/app/projects/polished-glitter-90679345), production branch `br-damp-scene-au6uzev7`, database `harboriq_marketing`.
- **Public website:** [HarborIQ on Vercel](https://harboriq-gamma.vercel.app).
- **Source of truth:** current Project Files checkout, `website/harboriq-marketing-site/`. The prior `harbor-iq-...` checkout is stale; do not deploy from it.

The Vercel API returned Node 24.x before this repair. No Node runtime downgrade was performed. Runtime log retrieval was blocked by a connector host restriction, so no claim is made that a production stack trace was inspected.

## Diagnosis and changes

The repository declared `"type": "module"` while `api/tsconfig.json` emitted CommonJS. Its diagnostic `ping.js` also used `module.exports` inside that ES-module package. The minimal probe therefore did not establish that Node 24 was faulty.

The repair aligns API compilation and resolution with NodeNext and uses explicit `.js` relative import specifiers. Vercel supports ES modules and TypeScript functions; see its [Node.js runtime documentation](https://vercel.com/docs/functions/runtimes/node-js).

- Removed the misleading CommonJS diagnostic endpoint.
- Added a native compiled-JavaScript regression suite so module-load failures are detected before release.
- Corrected the dynamic enrichment rewrite to carry the lead ID.
- Lead submission now returns 503 when no durable database is configured, rather than logging personal details and returning false success.
- Removed raw exception logging on lead and chat handlers to reduce accidental disclosure.
- Invalid JSON now returns controlled client errors.
- Lead enrichment is administrator-only. Sequential IDs do not authorize changes to a lead. The public request form completes after its four required fields and no longer sends visitors into the disabled second step. Reintroducing public optional enrichment requires signed, expiring per-submission tokens and frontend integration.
- Preserved the existing homepage and carried forward the founder-photo change previously requested in this session.

## Verification

`npm run test:api` compiles with TypeScript and runs Node's native test runner against the emitted files. All 13 tests passed after the availability-check update; these are regression tests, not a penetration test, load test, or full platform acceptance suite.

The Vite production build completed. Existing warnings remain for large bundles and a PostCSS plugin missing its `from` option. The serverless deployment completed and was promoted to production.

Live checks after promotion:

| Check | Observed result | Interpretation |
|---|---|---|
| [GET /api/health](https://harboriq-gamma.vercel.app/api/health) | 200 JSON | Function imports and runs; liveness only |
| [Homepage](https://harboriq-gamma.vercel.app) | 200 HTML | Marketing site responds |
| [GET /api/leads](https://harboriq-gamma.vercel.app/api/leads), no token | 401 JSON | Admin route remains protected |
| POST /api/leads, invalid body | 400 JSON | Input validation works |
| [GET /api/lead-status](https://harboriq-gamma.vercel.app/api/lead-status) | 200, available=true | Prepared lead table accessible |
| POST /api/leads through mobile form | 201 JSON, id=1 | Synthetic request stored; success confirmation visible |
| GET /api/leads with existing admin token | 200 JSON | Synthetic request retrieved after a fresh production redeployment |
| Repeated POST /api/leads with same test email | 201 JSON, duplicate=true, id=1 | Duplicate recognized; same record returned |
| POST /api/chat, valid message | 503 JSON | Controlled unavailable response; no AI key configured |
| Public optional enrichment | Disabled in UI; administrator-only API | Not presented as a working public workflow |

Initial runtime tests used `runtime-test@example.invalid` and were not stored before database setup. The later end-to-end test used `website-verification-20260922@example.invalid`, with the name `SYNTHETIC WEBSITE VERIFICATION` and business `HarborIQ deployment test - not a prospect`. That record is retained as verification evidence, not a genuine customer or lead. No outbound notification was sent.

## Remaining blockers

### Lead storage: resolved

Neon connected at 12:53 EDT. The account had no projects and reported the Free plan. A new `harboriq-marketing` project was created in AWS US East 1, PostgreSQL 17, with 0.25 CU minimum/maximum and no plan upgrade.

Applied `migrations/001_marketing_leads.sql` separately using the owner connection. Runtime DDL was removed from the API. A SQL-created `harboriq_web` login has no superuser, database-creation, role-creation, schema-creation, inherited-role, or DELETE privileges. It can SELECT/INSERT leads, use the ID sequence, and update only the enumerated optional enrichment columns.

The database URL was installed as a sensitive production-only Vercel environment variable without displaying its password. An initially created API role was too privileged and was removed unused; it was never installed in the website. Temporary secret-transfer files were removed after use.

Verified through the actual mobile form, the Neon database, and the authenticated admin API. The test record survived a fresh production redeployment and duplicate submission returned the existing ID.

Before increasing public traffic, add durable/edge abuse protection; current per-instance rate limiting is best effort. Automated lead email notifications are not configured or tested. Leads are accessible through the protected admin view; do not assume submissions trigger an email.

### AI assistant

Set the authorized `ANTHROPIC_API_KEY` in Vercel's encrypted production environment and redeploy. Verify model availability and account billing, then test a benign request and error handling. No live model completion was tested in this repair.

### Primary domain

The [main domain](https://harboriq.com) returned HTTP 401 with a Basic authentication challenge. Public DNS returned Cloudflare nameservers `norah.ns.cloudflare.com` and `tate.ns.cloudflare.com`. That establishes Cloudflare as authoritative DNS, not which account owns the zone.

Vercel's project-domain response showed both `harboriq.com` and `www.harboriq.com` as unverified. The existing `www` binding is configured to redirect to the apex with HTTP 308.

The connected Cloudflare service failed with an invalid X-Auth-Key header, including after the user successfully reconnected it at 12:53 EDT. The previously approved saved API token authenticated successfully but returned no visible zone for `harboriq.com`. No DNS records or nameservers were changed. Cloudflare's forgot-email recovery request for the domain was accepted with its conditional notification message; no recovery email was found in the connected Gmail or Outlook inboxes during this work.

Once the correct Cloudflare account is accessible, add these two distinct TXT records returned by Vercel. Re-query Vercel before editing in case its verification requirements have changed.

| Type | Name | Value |
|---|---|---|
| TXT | `_vercel.harboriq.com` | `vc-domain-verify=harboriq.com,e60b0305ed903398f482` |
| TXT | `_vercel.harboriq.com` | `vc-domain-verify=www.harboriq.com,1bf6a985981dfaa86b67` |

Then retrieve the exact project-specific A/CNAME targets from Vercel. Snapshot existing DNS, change only the relevant website records after checking for other uses, preserve mail and unrelated records, verify ownership and TLS, and test apex, www redirect, homepage, assets, and API.

Do not switch nameservers, disable security protections globally, or remove unrelated DNS to force a deployment. Do not point both domain and production traffic at a different project.

## Decision and risk register

| Item | Decision or risk | Owner | Next evidence required |
|---|---|---|---|
| ADR: runtime | Fix ESM/CommonJS mismatch, retain deployed Node runtime | Engineering | Native module tests and live 200 health passed |
| ADR: persistence | Dedicated Neon database, restricted runtime login, explicit migration | Engineering | Durable write/read/redeploy test passed; monitor usage and backups |
| Risk: public lead enrichment | Sequential ID endpoint is unsafe without authorization | Engineering | Scoped expiring token flow; public enrichment blocked meanwhile |
| Risk: main domain | Wrong-account DNS access and unverified Vercel binding | Founder | Correct Cloudflare zone access and verified domain |
| Risk: assistant | Missing AI credential | Founder / Engineering | Secure configuration and successful live completion |
| Risk: abuse protection | Memory-only counters do not cover distributed invocations | Engineering | Durable/edge rate limiter and bounded abuse tests |
| Assumption | Existing Vercel project is the intended marketing host | Founder | Supported by existing project/domain association; revisit only if hosting decision changes |

Infrastructure cost: database created under the account's existing Free plan; no paid plan upgrade purchased. Monitor quotas before onboarding customers. AI usage costs remain unestimated pending account and usage confirmation. Product revenue and retention metrics were not inspected; the synthetic test record is not evidence of market validation or full product readiness.

## Rollback and operational checks

Prefer a forward fix. The former deployment has known crashing APIs and should not be restored casually. If a new regression requires rollback, use the recorded previous deployment after assessing that trade-off.

For future repairs, confirm `.vercel/project.json` points to the project and team above. Run `npm run test:api`, build, deploy without switching traffic where possible, smoke-test through authorized preview access, then promote and repeat live tests. Do not disable preview authentication merely to test.

In this session, preview authentication bypass was unavailable through the connector; production was promoted after local tests and immediately checked using its existing public production alias. No preview protection setting was changed.

## Change log

- September 22, 2026, database activation: created Neon project and prepared leads schema; installed restricted runtime URL as a sensitive Vercel variable; removed request-time DDL; passed 13 regression tests and real mobile submission/readback/redeployment/duplicate checks. Lead capture is working on Vercel. Cloudflare credential-format failure persists after reconnection; main domain and AI are still unresolved.
- September 22, 2026, form follow-up: added public no-store lead-availability check and shared fail-closed UI gate for demo, generic, and chat lead forms. Missing storage no longer invites PII collection or promises saved submissions. Added browser retry control and click-to-call fallback; removed email fallback from the demo contact card and chat failure state. API regression suite now has 13 passing tests, full TypeScript check passes, and mobile/desktop browser checks cover missing storage, retry, subsequent 503, and failed status fetch. Database connectivity and end-to-end persistence remain unverified and blocked.
- September 22, 2026: repaired module format mismatch; added 12 API regression tests; changed missing-database behavior to fail closed; restricted unauthenticated enrichment; deployed and verified production runtime.
- September 22, 2026: recorded missing database and AI configuration, unresolved main-domain ownership verification, and correct checkout path. No DNS change, database provisioning, or new subscription was performed.
