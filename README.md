# Z0roCode Estates

> A production-grade real estate marketplace — browse homes, filter results, view
> detailed listings, estimate a mortgage, book consultations, get a home
> valuation, and manage leads through a full admin CRM.

**Live demo:** _[add your Vercel URL here once deployed]_

Built as a portfolio piece for the Z0roCode web design studio. This is a
showcase, not a live brokerage — email sending is simulated (logged to the
database), auth is lightweight, and client stories are illustrative. The
architecture is production-shaped; the implementation is demo-honest.

---

## Quick start (local)

```bash
bun install
cp .env.example .env          # set DATABASE_URL to a local or hosted Postgres
bun run db:push               # create the schema
bun run seed                  # seed 18 listings, 5 agents, sample leads
bun run dev                   # http://localhost:3000
```

No API keys required. Real photography is pre-seeded.

---

## Deploy to Vercel + Neon (recommended)

The app uses **PostgreSQL** so it works on Vercel's serverless platform.
SQLite files don't persist on Vercel, so you need a hosted Postgres. Neon is
the easiest — its dashboard shows the connection string directly, no password
encoding headaches.

1. **Create a free Postgres database** at [neon.tech](https://neon.tech)
2. Copy the connection string from the Neon dashboard (it's on the home page,
   looks like `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`)
3. **Add it as `DATABASE_URL`** in Vercel → Settings → Environment Variables
4. **Push to GitHub** — Vercel auto-runs `postinstall: prisma generate` and `next build`
5. **Create the schema + seed data.** After the first deploy, run once:
   ```bash
   DATABASE_URL="your-neon-connection-string" bun run db:push
   DATABASE_URL="your-neon-connection-string" bun run seed
   ```
6. Redeploy. The site is now fully functional.

**Supabase also works** — see `supabase-setup.sql` for a one-paste SQL
alternative that creates all tables + seed data in Supabase's SQL Editor.

### Why Neon over Supabase?

Neon is built specifically for serverless (Vercel). The connection string is
on the dashboard with no password-field guesswork, the pooler is on by
default, and the string just works. Supabase is great but their connection UX
is currently confusing.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Vercel (Next.js 16 App Router, serverless)         │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  Public site │  │  Client app │  │  Admin CRM │  │
│  │  11 routes   │  │  3 routes   │  │  6 routes  │  │
│  └──────┬───────┘  └──────┬──────┘  └─────┬──────┘  │
│         │                 │               │         │
│         └────────┬────────┴───────────────┘         │
│                  ▼                                  │
│         ┌────────────────┐  ┌──────────────┐        │
│         │  22 REST API   │  │  Prisma ORM  │        │
│         │  routes        │──│  (v6)        │        │
│         └────────┬───────┘  └──────┬───────┘        │
│                  │                 │                 │
│         ┌────────▼────────┐        │                 │
│         │ Rate limiter    │        │                 │
│         │ Honeypot        │        │                 │
│         │ Zod validation  │        │                 │
│         │ Error std.      │        │                 │
│         └─────────────────┘        │                 │
└─────────────────────────────────────┼────────────────┘
                                      ▼
                            ┌──────────────────┐
                            │  PostgreSQL      │
                            │  (Neon/Supabase) │
                            │  8 models        │
                            └──────────────────┘
```

**Pattern:** Modular monolith (single Next.js app, clear separation between
public/client/admin/API layers). No microservices — the demo's scale doesn't
justify the operational complexity. The API layer is structured so extracting
a service (e.g. a leads service) later is straightforward.

**Data pattern:** Traditional CRUD with Prisma. JSON-encoded arrays for
SQLite/Postgres portability (`images`, `features`, `amenities`, `nearby`,
`history` columns).

**Reliability:** Every API route wraps DB calls in try/catch and returns a
graceful empty state or standardized error. No route crashes the app. A
`/api/health` endpoint reports database connectivity for uptime monitoring.

**Security:** Defense in depth — zod validation on every write, honeypot fields
on public forms, per-IP rate limiting on form endpoints, httpOnly session
cookies, no raw HTML from user input, no API keys on the client.

---

## What's inside

### 21 pages across 5 layers

| Layer | Routes | Purpose |
|---|---|---|
| **Public marketing** | `/`, `/buy`, `/buy/[slug]`, `/sell`, `/sell/valuation`, `/agents`, `/agents/[slug]`, `/insights`, `/insights/[slug]`, `/about`, `/contact` | The full buyer + seller funnel |
| **Client app** | `/dashboard`, `/auth/sign-in`, `/auth/sign-up` | Saved homes, appointments, session |
| **Admin panel** | `/admin`, `/admin/properties`, `/admin/leads`, `/admin/appointments`, `/admin/agents`, `/admin/analytics` | Agency back office + CRM |
| **Agent workspace** | `/agent-dashboard` | Agent's listings, leads, pipeline |
| **Setup** | `/admin/setup` | One-click DB connection checker + seeder |

### 22 REST API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/properties` | List + filter + sort |
| `GET` | `/api/properties/[slug]` | Single property (increments views) |
| `GET` | `/api/properties/featured` | Homepage featured grid |
| `GET` | `/api/agents` | Team list |
| `GET` | `/api/agents/[slug]` | Agent profile + listings |
| `POST` | `/api/signup` | Onboarding → User + Lead + session |
| `POST` | `/api/appointments` | Booking (double-booking guard) |
| `POST` | `/api/leads` | Newsletter / contact (honeypot) |
| `POST` | `/api/valuation` | Home estimate from comps |
| `POST` | `/api/list-property` | Seller submission (pending approval) |
| `POST` | `/api/save` | Toggle saved property |
| `POST` | `/api/track-view` | Increment view count |
| `GET` | `/api/dashboard` | Client dashboard data |
| `GET` | `/api/admin/stats` | Admin overview metrics |
| `GET` | `/api/admin/leads` | Full lead board |
| `GET/PATCH` | `/api/admin/leads/[id]` | Move lead stage |
| `GET` | `/api/admin/properties` | All properties (incl. pending) |
| `PATCH` | `/api/admin/properties/[id]` | Approve / feature / status |
| `GET` | `/api/admin/appointments` | All appointments |
| `GET/POST` | `/api/admin/setup` | DB connection check + one-click seed |
| `POST` | `/api/auth/demo` | Instant demo-user sign-in |
| `GET` | `/api/health` | Health check (DB connectivity) |

**API contract:** All errors return a standardized shape:
```json
{ "error": "Human-readable message", "code": "ERROR_CODE", "issues": {} }
```
Status codes: 400 (bad input), 401 (auth), 404 (not found), 409 (conflict),
422 (validation), 429 (rate limited), 500 (server error).

---

## Database schema

8 Prisma models. Full schema in `prisma/schema.prisma`.

| Model | Purpose | Key relations |
|---|---|---|
| `Agent` | Real estate agents | 1 → many `Property` |
| `Property` | Listings | belongs to `Agent`, many `Inquiry`, `SavedProperty` |
| `User` | Clients / admins / agents | many `SavedProperty`, `Lead`, `Appointment` |
| `SavedProperty` | Bookmarked homes | belongs to `User` + `Property` |
| `Inquiry` | Per-property contact | belongs to `Property` + `User` |
| `Lead` | CRM pipeline | belongs to `User` (optional) |
| `Appointment` | Consultation bookings | belongs to `User` (optional) |
| `Notification` | Email stand-in | standalone (ref to lead/appt/property) |

Indexes on `city`, `type`, `status`, `price`, `bedrooms`, `featured`,
`approved`, `lead.stage`, `lead.source` for query performance.

---

## Backend engineering decisions

**Layered architecture.** Route handlers are thin — they handle HTTP concerns
(validate, rate-limit, set cookies) and delegate business logic to a services
layer (`src/lib/services/`). This keeps routes readable, makes business logic
testable in isolation, and means swapping the HTTP layer (e.g. to a webhook or
cron job) doesn't require rewriting the logic. The layers:

```
Route handler  →  Validator (zod)  →  Service (business logic)  →  Prisma
     ↑                  ↑                    ↑                       ↑
 HTTP concerns     Input shape        Domain rules            Data access
 (auth, CORS,      (honeypot,         (create lead,           (queries,
  rate limit,      type checks)       send notification,      mutations)
  response)                           check conflicts)
```

**Centralized configuration.** All environment access and magic numbers
(rate limits, pagination defaults, enum values) live in `src/lib/config.ts`.
This makes tuning and auditing trivial — change a rate limit in one place, not
across five route files.

**Extracted validators.** Zod schemas live in `src/lib/validators/`, separate
from both the routes and the services. This means the same schema can validate
the client-side form and the API, and the schemas are documented in one place.

**Prisma client logging is environment-aware.** In development, queries are
logged (useful while building). In production, only errors and warnings are
logged — query logging floods Vercel's log explorer, leaks schema info, and
adds overhead. See `src/lib/db.ts`.

**Rate limiting is in-memory per-instance.** A simple token-bucket limiter
protects public form endpoints (5 signups/bookings/valuations per 10 min, 10
leads per 10 min, 3 property submissions per hour). On Vercel's serverless
(this is per-instance, not distributed). For true distributed rate limiting,
swap in Upstash Redis — the interface in `src/lib/rate-limit.ts` is designed
for that drop-in.

**Every write endpoint validates with zod** on the server. Client-side
validation is for UX only and is never trusted.

**Honeypot fields** on `leads` and `signup` endpoints silently accept bot
submissions (returning `{ ok: true }`) so bots don't retry — cleaner than
CAPTCHAs for a demo.

**Graceful degradation.** Public API routes (`/api/properties`,
`/api/properties/featured`, `/api/agents`) catch DB errors and return empty
arrays instead of crashing. This means the site loads cleanly even before the
database is seeded, showing empty states instead of error pages.

**Email is simulated.** Every "send email" step writes a row to the
`Notification` table and logs to console. No real email is sent. The success
screens tell the user exactly what would happen. Swapping in a real email
provider (Resend, Postmark) means replacing the `db.notification.create` calls
with an API call — the contract doesn't change.

---

## Security

- **No API keys in the codebase.** `.env.example` documents the only optional
  key (`UNSPLASH_ACCESS_KEY`); the demo never reads it at runtime.
- **Server-side validation** with zod on every write endpoint.
- **Honeypot + rate limiting** on all public form endpoints.
- **httpOnly session cookies** — not accessible to JavaScript.
- **No raw HTML rendered from user input.** All user text is stored and
  displayed as plain text.
- **Admin routes are client-rendered** (no real auth gate in the demo). The
  README is honest about this. Production would add NextAuth + middleware.
- **Prisma bypasses Supabase RLS** — RLS configuration is irrelevant to this
  app since Prisma connects as the `postgres` superuser.

---

## Design system

- **Color:** emerald accent (`oklch(0.45 0.108 162.5)`) on near-black/white,
  dark-mode ready
- **Type:** Geist Sans + Geist Mono, clamp-based scale
- **Motion:** Framer Motion, 150–600ms ease-out, respects
  `prefers-reduced-motion` throughout
- **Responsive:** 375 / 768 / 1440 verified, sticky mobile bottom bar,
  44px tap targets
- **SEO:** JSON-LD structured data (RealEstateAgent, Residence, FAQPage,
  Article, BreadcrumbList), per-page metadata, dynamic sitemap, robots.txt
- **Accessibility:** skip-to-content link, ARIA roles on modals, keyboard
  navigation, semantic HTML

---

## Known limitations

1. **Email sending is simulated** — writes to the `Notification` table, no real
   email sent.
2. **Mortgage calculator is principal + interest only** — excludes taxes,
   insurance, PMI, HOA.
3. **Auth is lightweight** — signed cookie, not NextAuth. "Explore as demo
   user" button exists for portfolio reviewers.
4. **Admin routes are not auth-gated** — anyone can view `/admin` in the demo.
5. **Rate limiting is per-instance** — fine for demo traffic; use Upstash Redis
   for production distributed limiting.
6. **Image search was done at authoring time** — photo set is fixed. Re-run the
   seed with new URLs to refresh.
7. **Analytics data is illustrative** — traffic chart uses demo numbers. Wire
   up Plausible, Fathom, or GA4 for production.
8. **Client stories are illustrative** — testimonials are realistic voices,
   clearly framed as demo content.

---

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start the dev server on port 3000 |
| `bun run build` | Production build (`next build`) |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push the Prisma schema to the database |
| `bun run seed` | Seed 18 listings, 5 agents, sample leads/appointments |
| `bun run db:reset` | Reset the database (force) |

---

## Project structure

```
src/
├── app/                          # Next.js App Router (routes + API)
│   ├── page.tsx                  # Homepage
│   ├── buy/                      # Listings + property detail
│   ├── sell/                     # Seller landing + valuation
│   ├── agents/                   # Team + agent profiles
│   ├── insights/                 # Market insights articles
│   ├── about/                    # About
│   ├── contact/                  # Contact
│   ├── dashboard/                # Client dashboard
│   ├── admin/                    # Admin panel (6 routes + setup)
│   ├── agent-dashboard/          # Agent workspace
│   ├── auth/                     # Sign in / sign up
│   ├── api/                      # 22 REST endpoints
│   ├── sitemap.ts                # Dynamic sitemap (DB-driven)
│   └── robots.ts                 # Robots.txt
│
├── components/                   # Organized by domain
│   ├── layout/                   # header, footer, mobile-bar, admin-shell
│   ├── property/                 # card, gallery, mortgage-calculator, map
│   ├── modals/                   # booking, signup, list-property, shell, host
│   ├── marketing/                # hero, trust-bar, why, journeys, testimonials
│   ├── forms/                    # contact-form
│   └── ui/                       # shadcn/ui primitives
│
├── lib/                          # Backend infrastructure (layered)
│   ├── db/                       # Data access
│   │   ├── client.ts             #   Prisma singleton, env-aware logging
│   │   └── index.ts              #   barrel export
│   ├── types/                    # Shared domain types
│   │   └── index.ts              #   Property, Agent, Lead, API payloads
│   ├── api/                      # API infrastructure
│   │   ├── errors.ts             #   standardized error responses + codes
│   │   ├── response.ts           #   standardized success responses
│   │   ├── rate-limit.ts         #   in-memory token-bucket limiter
│   │   └── index.ts              #   barrel export
│   ├── validators/               # Zod input schemas (reusable)
│   │   └── index.ts              #   signup, appointment, valuation, etc.
│   ├── services/                 # Business logic layer
│   │   ├── lead.service.ts       #   signup, booking, valuation, leads
│   │   └── index.ts              #   barrel export
│   ├── helpers/                  # Pure utilities
│   │   ├── format.ts             #   currency, dates, addresses
│   │   ├── slug.ts               #   URL slugify
│   │   └── index.ts              #   barrel export
│   ├── config.ts                 # Centralized env + constants + rate limits
│   ├── serialize.ts              # Prisma row → client-safe type
│   ├── schema.tsx                # JSON-LD structured data (SEO)
│   ├── modal-store.ts            # Zustand store for global modals
│   └── unsplash.ts               # Image helper (no-op by default)
│
├── hooks/                        # React hooks
│   ├── use-count-up.ts           # Animated stat counters
│   └── use-toast.ts              # Toast notifications
│
└── prisma/
    ├── schema.prisma             # 8 models, PostgreSQL
    └── seed.ts                   # 18 listings, 5 agents, sample leads
```

---

© Z0roCode Estates — a portfolio demo, not a real brokerage.
