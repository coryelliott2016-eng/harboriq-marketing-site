# HarborIQ marketing site

Source for the public marketing site (Vercel project `harbor-iq/harboriq`, live at https://harboriq-gamma.vercel.app until harboriq.com DNS is restored).

Stack: Vite + React + TypeScript + Tailwind (client), Vercel Node functions in `api/` (leads, lead status, health, chat), Neon Postgres for lead storage.

## Develop

```bash
npm ci
npm run check && npm run check:api && npm run test:api
npx vite build   # output: dist/public
```

## Rules

- `main` is protected: changes land by pull request with green CI.
- No placeholder copy, fake testimonials, invented metrics, or unverified certifications.
- Fundraising terms are not published on the site until counsel approves (CI enforces this).
- Secrets live only in Vercel encrypted environment variables (`DATABASE_URL`, `ADMIN_TOKEN`, `ANTHROPIC_API_KEY`). Never commit `.env` files.

Deployment status and history: see `BACKEND-REPAIR-2026-09-22.md`.
