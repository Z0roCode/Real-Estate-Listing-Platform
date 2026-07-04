# Z0roCode Estates

A production-grade real estate marketplace — browse homes, filter results, view
detailed listing pages with galleries, estimate a mortgage, book consultations,
get a home valuation, and manage leads through a full admin CRM. Built as a
portfolio project for the Z0roCode web design studio.

> **Portfolio demo.** This is a showcase, not a live brokerage. Email sending is
> simulated (logged to the database), auth is lightweight, and client stories are
> illustrative. The architecture is production-shaped; the implementation is
> demo-honest. See [Known limitations](#known-limitations).

---

## Quick start (local)

```bash
# 1. Install dependencies
bun install

# 2. Set up the database
#    For local dev you can use SQLite — temporarily set the provider in
#    prisma/schema.prisma to "sqlite" and use a file URL, OR run a local Postgres.
cp .env.example .env          # then edit DATABASE_URL
bun run db:push               # create the schema
bun run seed                  # seed 18 listings, 5 agents, sample leads

# 3. Run the dev server
bun run dev                   # http://localhost:3000
```

No API keys required. Real photography is pre-seeded.

## Deploy to Vercel

The app uses **PostgreSQL** (not SQLite) so it works on Vercel's serverless
platform. SQLite files don't persist on Vercel, so you need a hosted Postgres.

1. **Create a free Postgres database.** Recommended options (all work great):
   - [Supabase](https://supabase.com) (free tier, 500MB, built-in dashboard — easiest)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (one click from your Vercel dashboard)
   - [Neon](https://neon.tech) (free tier, serverless Postgres)
2. **Add the connection string** as `DATABASE_URL` in your Vercel project's
   Environment Variables (Settings → Environment Variables).
3. **Push to GitHub** (or use Vercel's Git integration) — Vercel runs
   `postinstall: prisma generate` and `next build` automatically.
4. **Push the schema and seed the database.** After the first deploy, run
   these once against your production database:
   ```bash
   # Set DATABASE_URL to your production connection string, then:
   bun run db:push
   bun run seed
   ```
   Or run them locally with `DATABASE_URL` pointing at your hosted Postgres.

The API routes are resilient: if the database isn't seeded yet, they return
empty arrays (not crashes), so the site loads cleanly while you set up.

### Using Supabase (recommended)

Supabase is the easiest option — it's hosted PostgreSQL with a free 500MB
tier and a nice dashboard.

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project. Pick any name, choose a region close to your users.
3. Once the project is ready, go to **Project Settings → Database**.
4. Find the **Connection string** section. Copy the **URI** (it looks like
   `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`).
   Use the **Session pooler** or **Transaction pooler** connection string
   (either works — the transaction pooler on port 6543 is best for
   serverless like Vercel).
5. Paste that string as `DATABASE_URL` in your Vercel project's environment
   variables.
6. Run the schema + seed once:
   ```bash
   DATABASE_URL="postgresql://postgres...@...supabase.com:6543/postgres" bun run db:push
   DATABASE_URL="postgresql://postgres...@...supabase.com:6543/postgres" bun run seed
   ```
7. Redeploy on Vercel. The listings will now load.

**Tip:** If you see a connection error during `db:push` or `seed`, add
`?pgbouncer=true` to the end of your connection string — this is required
for Supabase's pooled connections.

---

## What's inside

### 21 pages across 7 layers

| Layer | Routes | Purpose |
|---|---|---|
| **Public marketing** | `/`, `/buy`, `/buy/[slug]`, `/sell`, `/sell/valuation`, `/agents`, `/agents/[slug]`, `/insights`, `/insights/[slug]`, `/about`, `/contact` | The full buyer + seller funnel |
| **Client app** | `/dashboard`, `/auth/sign-in`, `/auth/sign-up` | Saved homes, appointments, lightweight session |
| **Admin panel** | `/admin`, `/admin/properties`, `/admin/leads`, `/admin/appointments`, `/admin/agents`, `/admin/analytics` | Agency back office + CRM |
| **Agent workspace** | `/agent-dashboard` | Agent's listings, leads, pipeline |
| **API** | 18 REST endpoints | Properties, agents, leads, appointments, valuation, auth, save, admin |
| **SEO** | `/sitemap.xml`, `/robots.txt` | Dynamic, DB-driven |
| **Docs** | `/docs/phase-1-strategy.md` through `phase-3-homepage.md` | The design process |

### Core features

- **Instant search + filtering** — client-side filtering with no page reload, server-side params for shareable URLs
- **Premium property cards** — save heart, quick tour, agent avatar, view count, days listed, hover micro-interactions
- **Full property detail** — gallery with Photos/Video/Floor-plan tabs + lightbox, nearby places (schools/hospitals/shopping/transit), property history, mortgage calculator, similar homes, recently viewed, save/share/brochure, sticky mobile bar
- **Three working modals** — booking (4-step calendar), onboarding/sign-up, list-a-property (6-step with photo picker) — all driven by a Zustand store so any button can open them
- **Home valuation flow** — 5-step form that derives a realistic estimate from demo comps and stores a seller lead
- **Admin CRM** — drag-and-drop kanban lead board, property approval queue, appointment calendar, analytics dashboard
- **Agent dashboard** — active listings, pipeline value, open leads
- **Demo user** — one-click "Explore as demo user" for instant dashboard access (portfolio reviewers)

### Design system

- **Color:** emerald accent (`oklch(0.45 0.108 162.5)`) on near-black/white, dark-mode ready
- **Type:** Geist Sans + Geist Mono, clamp-based scale (`.text-display`, `.text-h2`, `.text-h3`, `.eyebrow`)
- **Motion:** Framer Motion, 150–600ms ease-out, respects `prefers-reduced-motion` throughout
- **Spacing:** consistent 24/32/48px gutters, 96px section padding (clamp)
- **Shadows:** three-tier premium system (rest/hover/modal)

### SEO

- JSON-LD structured data: `RealEstateAgent` (homepage), `Residence` (property pages), `FAQPage` (sell), `Article` (insights), `BreadcrumbList`
- Per-page metadata via route layouts (title, description, canonical, OpenGraph)
- Dynamic `sitemap.xml` generated from the database
- `robots.txt` blocking admin/auth/API routes
- Semantic HTML, one H1 per page, breadcrumbs on detail pages

### Accessibility

- Skip-to-content link on every page
- ARIA roles on all modals (`role="dialog"`, `aria-modal="true"`)
- Keyboard navigation (Escape closes modals, arrow keys in gallery)
- 44px minimum tap targets, high contrast, `prefers-reduced-motion` respected
- Semantic HTML (`main`, `header`, `nav`, `section`, `article`, `footer`)

---

## Tech decisions

**Next.js 16 App Router + TypeScript.** One codebase for UI and API. The App Router gives us file-based routing, server/client component split, and built-in metadata API for SEO.

**PostgreSQL via Prisma.** The app runs on Vercel, where the filesystem is
read-only and SQLite files don't persist. PostgreSQL works everywhere — local,
Vercel, any cloud. Prisma means the schema is database-agnostic: swapping back
to SQLite for a purely-local demo is a one-line `datasource` change. API routes
are wrapped in try/catch so the site loads cleanly even before the database is
seeded (returns empty arrays, not crashes).

**Client-side filtering on a single fetch.** With 18 listings, fetching once and filtering in the browser gives genuinely instant UX. The API still exposes server-side filter params for shareable, pre-filtered URLs.

**Zustand for modal state.** A single store controls the booking, sign-up, and list-a-property modals. Any button anywhere can open them with context (e.g. "schedule a viewing for this property"). This is what makes every CTA actually do something.

**Lightweight session instead of NextAuth.** A signed `httpOnly` cookie with the user ID is enough for the demo. NextAuth is available in the stack if you want real OAuth/credentials for production.

**Real photography, curated and cached.** Images are real web photos fetched once at authoring time via the z-ai image-search tool. Sources were filtered to reputable editorial/architectural/free-stock sites only — watermarked stock libraries were excluded. Each listing's exterior is matched to its described architectural style. URLs are cached in the DB so no API key is ever exposed at runtime.

**OpenStreetMap embed.** No Google Maps API key required. Loads entirely client-side.

---

## Security

The codebase has deliberate, layered security — the kind you can describe in
an interview: "admin routes are protected by middleware, sessions are signed,
here's the file."

- **Admin routes are middleware-protected.** `src/middleware.ts` gates every
  `/admin/*` page and `/api/admin/*` endpoint behind an `admin_session` cookie
  that must match `ADMIN_SECRET`. Page requests without it redirect to
  `/admin/login`; API requests return 401. The login page
  (`/admin/login`) is the one publicly accessible admin route, and it sets
  the cookie after a constant-time password comparison. Without
  `ADMIN_SECRET` configured, the admin panel is inaccessible (fail closed).
- **Session cookies are signed, not raw.** The `zc_session` cookie stores
  `userId.hmacSignature` using `SESSION_SECRET`. A tampered cookie (e.g.
  someone changing the userId to impersonate another user) fails
  verification and is rejected. See `src/lib/auth/session.ts`. The
  middleware also strips tampered cookies early so downstream code never
  sees a forged session.
- **No API keys in the codebase.** `.env.example` documents every env var;
  none are committed.
- **Server-side validation on every write endpoint** with zod. Client
  validation is for UX only and is never trusted.
- **Honeypot + rate limiting on all public forms.** Signups, bookings,
  valuations, property submissions, and leads are all rate-limited per IP
  and have honeypot fields that silently accept bot submissions.
- **No raw HTML rendered from user input.** All user text is stored and
  displayed as plain text.
- **Error messages are sanitized.** Server errors are logged with full
  detail server-side; clients receive generic messages so Prisma connection
  strings and table names aren't leaked.
- **httpOnly, secure, sameSite cookies.** Both session and admin cookies
  are httpOnly (no JS access), secure in production (HTTPS only), and
  sameSite=lax (CSRF protection).

### Required environment variables for production

Set these on Vercel (Settings → Environment Variables):

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://...` |
| `ADMIN_SECRET` | Admin panel password | a strong random string |
| `SESSION_SECRET` | Signs session cookies | `openssl rand -hex 32` |

---

## Known limitations

1. **Email sending is simulated.** Every "send email" step writes a row to the `Notification` table and logs to console. No real email is sent. The README and the UI success screens say exactly what would happen.
2. **The mortgage calculator is principal + interest only.** It excludes property taxes, insurance, PMI, and HOA. The formula is commented in the code.
3. **Auth is lightweight but signed.** Sessions use a signed HMAC cookie (not NextAuth). The "Explore as demo user" button exists for portfolio reviewers. Production would upgrade to NextAuth with role-based access, but the current signing scheme prevents the impersonation risk of raw user-ID cookies.
4. **Admin auth is a single password, not RBAC.** The middleware + login gate protects all admin routes behind one `ADMIN_SECRET`. This is right-sized for a portfolio (one owner) — a real brokerage would add user accounts with roles.
5. **Database setup required for Vercel.** The app uses PostgreSQL. You must create a hosted Postgres (Vercel Postgres or Neon), add `DATABASE_URL` to Vercel env vars, and run `bun run db:push && bun run seed` against it once. Until seeded, the site shows empty states (not crashes).
6. **Image search was done at authoring time.** The photo set is fixed. To refresh, re-run the seed with new URLs.
7. **Analytics data is illustrative.** The traffic chart uses demo numbers. Wire up Plausible, Fathom, or GA4 for production.
8. **Client stories are illustrative.** Testimonials and case studies are written as realistic voices, clearly framed as demo content.

---

## Database schema

7 models: `Agent`, `Property`, `User`, `SavedProperty`, `Inquiry`, `Lead`, `Appointment`, `Notification`. Full schema in `prisma/schema.prisma`.

---

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start the Next.js dev server on port 3000 |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push the Prisma schema to the database |
| `bun run seed` | Seed 18 listings, 5 agents, sample leads/appointments |
| `bun run db:reset` | Reset the database (force) |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── buy/                  # Listings + property detail
│   ├── sell/                 # Seller landing + valuation
│   ├── agents/               # Team + agent profiles
│   ├── insights/             # Articles
│   ├── about/                # About
│   ├── contact/              # Contact
│   ├── dashboard/            # Client dashboard
│   ├── admin/                # Admin panel (6 routes)
│   ├── agent-dashboard/      # Agent workspace
│   ├── auth/                 # Sign in / sign up
│   ├── api/                  # 18 REST endpoints
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Robots.txt
├── components/               # 30+ components
├── lib/                      # Types, format, serialize, schema, modal store
├── hooks/                    # use-count-up, use-toast
└── prisma/                   # Schema + seed
```

---

© Z0roCode Estates — a portfolio demo, not a real brokerage.
