# SCN Jobs — Frontend

Next.js 14 (App Router), TypeScript, Tailwind. Talks to the PORTAL-master
backend you already built — nothing in that repo was touched.

## Routing (exactly what you asked for)

| URL                     | Who sees it                         | Guard                          |
|--------------------------|--------------------------------------|---------------------------------|
| `scnjobs.com/`           | Worker signup/login + job listing    | none (guest gets signup gate)   |
| `scnjobs.com/admin/*`    | super_admin panel                    | `src/app/admin/layout.tsx`      |
| `scnjobs.com/recruiter/*`| recruiter panel                      | `src/app/recruiter/layout.tsx`  |
| `scnjobs.com/dashboard`  | worker's own profile + applications  | `src/app/dashboard/layout.tsx`  |

A recruiter/admin who lands on `/` gets bounced to their own portal
automatically (see `src/app/page.tsx`). Login is a single form at
`/login` for all three roles — it reads the role back from the login
response and redirects accordingly (`src/lib/roles.ts`).

## SSR vs CSR — where and why

- **Server Components (SSR)** do every *read*: job listings, job detail,
  recruiter's own jobs, admin's recruiter list, worker's applications.
  They call the backend directly from the server (`src/lib/api-server.ts`),
  forwarding the visitor's cookie via `next/headers`. The page arrives
  already populated — no loading spinner on first paint, and it works
  even if the visitor has JS disabled.
- **Client Components ("use client")** exist only where there's real
  interactivity: forms, buttons that mutate something, the search box
  on the job list. They call the same-origin `/api/*` path
  (`src/lib/api-client.ts`), which `next.config.mjs` proxies to your
  Express backend — the browser never talks to the backend host
  directly, so there's no CORS to configure.
- **No data loss / prop drilling contract:** every Server Component
  fetches data once and hands it down as a typed prop
  (`src/lib/types.ts` mirrors your Prisma schema field-for-field). A
  Client Component never re-fetches on mount to "sync" — the SSR
  payload passed in as a prop *is* the initial state
  (see `JobList.tsx`'s `initialJobs` prop for the clearest example).

## Running it

```bash
cd scnjobs-frontend
npm install
cp .env.example .env.local   # set BACKEND_URL to your Render URL
npm run dev
```

For production, put this behind whatever serves `scnjobs.com` and set
`BACKEND_URL` to wherever the Express API actually runs (or keep them
on the same box behind one reverse proxy — either works, since the
frontend proxies `/api/*` itself).

## Three things to decide / fix on the backend side (not touched here)

1. **No public job listing.** `GET /api/jobs` requires `requireAuth`,
   so a guest at `scnjobs.com` currently can't see any listings before
   signing up — the guest view shows a signup gate instead. If you
   want a real public job board (usually better for worker acquisition),
   add an unauthenticated `GET /jobs/public` route that returns a
   trimmed field set, and I'll wire the guest landing to it.
2. **CORS / cookies:** there was no `cors` middleware and
   `cookie-session` is set to `{ signed: false, secure: false }` — fine
   for local dev. The frontend sidesteps this entirely via the
   `next.config.mjs` rewrite (browser only ever talks to `scnjobs.com`).
   You still need `secure: true` on the cookie once you're on HTTPS in
   prod, or the browser will silently drop the cookie.
3. **Two list endpoints return bare rows with no relations included**
   (`application.repository.listByWorker` / `listByJob` — no `include`).
   I worked around this on the frontend (`src/lib/data/applications-mine.ts`
   does a manual join against job titles for the worker dashboard), but
   the recruiter's applicant list can only show a worker ID until they
   click into the detail page (which does include the worker relation).
   Cheapest real fix: add `include: { job: true }` / `include: { worker: true }`
   to those two repository methods.

## What's built vs. what's a stub

**Fully wired:** registration → OTP verify (with the dev-OTP shown on
screen as a stopgap for your SMS/DLT issue) → login → role-based
redirect → job browsing → apply → worker dashboard → admin recruiter
CRUD (create/activate/deactivate) → recruiter job posting → job status
transitions → applicant list → applicant status transitions.

**Intentionally left as your next extension point**, following the
same patterns already in the codebase (SSR data fetch in a `page.tsx`
+ typed prop into a `"use client"` form using `apiClient`):
- Worker profile edit (`/dashboard/profile`) and education/experience
  CRUD — `worker.routes.ts` already has all the endpoints, this repo
  just doesn't have the forms yet.
- Job edit form (`PATCH /jobs/:id`).
- Admin recruiter edit / category reassignment screens.
- Worker search for recruiters (`GET /worker/search`).

Each of those is a repeat of a pattern that already exists twice in
this repo (see the recruiter form + admin form) — happy to build any
of them out next.
