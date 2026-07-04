# Phase 2 — Sitemap, Navigation, Content and CTA Strategy

Locks the structure before any code. Every route, every nav item, every page section, every CTA. Demo-honest: real UI and real data, with email and CRM simulated by logging to the database.

---

## 1. Complete sitemap

### Public marketing

| Route | Purpose | Primary audience | Demo status |
|---|---|---|---|
| `/` | Homepage. The full pitch in one scroll. | Everyone | Fully built |
| `/buy` | All listings with the full search and filter experience. | Buyers, investors | Fully built |
| `/buy/[slug]` | Property detail. Real URL, shareable, SEO indexed. | Buyers | Fully built |
| `/buy/featured` | Featured only, pre filtered. | Buyers | Built (filter preset) |
| `/buy/luxury` | Luxury tier ($1.5M+), pre filtered. | Investors, luxury buyers | Built (filter preset) |
| `/sell` | Seller landing. Speaks directly to sellers. | Sellers | Fully built |
| `/sell/valuation` | Home valuation lead capture flow. | Sellers | Fully built |
| `/agents` | Team page. Real people, specialties, bios. | Everyone | Fully built |
| `/agents/[slug]` | Agent profile. Listings, bio, contact. | Everyone | Fully built |
| `/insights` | Market insights index. SEO and email fuel. | Everyone | Built with 4 to 6 articles |
| `/insights/[slug]` | Article page. | Everyone | Built with full body copy |
| `/about` | About. Who we are, how we work, the team. | Everyone | Fully built |
| `/contact` | Contact page with real form. | Everyone | Fully built |

### App (authenticated)

| Route | Purpose | Primary audience | Demo status |
|---|---|---|---|
| `/dashboard` | Client dashboard. Saved, viewed, appointments, messages. | Clients | Fully built, reads from DB |
| `/admin` | Admin overview. Leads, revenue, views, pending. | Admin | Fully built, reads from DB |
| `/admin/properties` | Property management and approval queue. | Admin | Fully built |
| `/admin/leads` | Lead management and CRM board. | Admin | Fully built |
| `/admin/appointments` | Appointment calendar. | Admin | Fully built |
| `/admin/agents` | Agent management. | Admin | Fully built |
| `/admin/analytics` | Traffic, conversion, sources. | Admin | Built with demo data |
| `/agent-dashboard` | Agent workspace. Listings, leads, pipeline. | Agents | Fully built |
| `/auth/sign-in` | Sign in. | Everyone | Built (lightweight) |
| `/auth/sign-up` | Onboarding. Also opens as modal from buttons. | Everyone | Built |

### Notes on the demo

- Auth uses a lightweight session (NextAuth credentials or a simple signed cookie). For the portfolio demo, a single click "explore as demo user" button signs you in instantly so a reviewer can see every dashboard without friction.
- Email sending is simulated. Every "send email" step writes a row to a `Notification` table and logs to the console. The README states this honestly.
- CRM is the `Lead` and `Inquiry` tables, surfaced in `/admin/leads`.
- Booking reserves a slot in the `Appointment` table. No real calendar invite is sent, but the success screen shows exactly what would happen.

---

## 2. Navigation design

### Primary nav (desktop, left/center)

| Item | Behavior |
|---|---|
| Buy | Dropdown: Browse all, Featured, Luxury, New listings |
| Sell | Dropdown: Get a valuation, List with us, Selling process |
| Agents | Link to `/agents` |
| Insights | Link to `/insights` |
| About | Link to `/about` |

### Utility nav (desktop, right)

| Item | Behavior |
|---|---|
| Saved (heart + count) | Opens `/dashboard#saved` if signed in, else opens sign-up modal |
| Sign in | Link to `/auth/sign-in` |
| Book a consultation | Primary button. Opens the booking modal. |

### Mobile nav

- Hamburger opens a full screen sheet with the full primary nav plus utility items.
- Sticky bottom bar (visible on key scroll positions): Search · Saved · Book a call. Three thumb friendly targets. The bottom bar hides on the property detail page where a sticky "Inquire / Schedule viewing" bar takes over.

### Footer nav

Four columns: Explore (Buy, Featured, Luxury, Open houses), Company (About, Agents, Insights, Careers), Sell (Get a valuation, List with us, Selling process), Get in touch (phone, email, office, social). Plus a slim legal row and a final email capture input.

### Why this structure

Two audience first entries in the nav (Buy, Sell) because every visitor is one or the other and we should not make them hunt. Insights earns a top slot because it is our SEO engine and email capture workhorse. "Book a consultation" is always one tap away. The mobile bottom bar means a phone visitor is never more than one thumb tap from search, saving, or talking to a human.

---

## 3. Page hierarchy (section order per page)

### Homepage `/`

The homepage answers, in order: who we are, why trust us, what we have, how it works, what if I'm buying, what if I'm selling, who will I help me, do they know their market, can I see proof, what now.

1. **Hero.** Headline, subhead, primary CTA (Book a consultation), secondary CTA (Browse homes), trust indicators (years, clients, sales, rating — all honestly framed), hero visual, inline search.
2. **Trust bar.** Four honest indicators with a clear "as featured" or "in business since" framing. No fabricated ratings.
3. **Featured listings.** Six handpicked homes in a premium carousel or grid. Each card is the upgraded card (see Phase 4).
4. **Why Z0roCode.** Four differentiators that are actually different (not "real photos"). Process transparency, dual journey expertise, concierge communication, data backed pricing.
5. **How it works.** Two tabs: Buying and Selling. Four steps each. Calm, visual, no jargon.
6. **Buyer and seller journeys.** Two side by side cards. "I'm buying a home" and "I'm selling my home". Each links to its flow.
7. **Meet the agents.** Three to four agent cards with photos, specialties, and a one line note.
8. **Market insights teaser.** Three latest articles. Each a doorway to email capture.
9. **Testimonials / case studies.** Two to three realistic client stories, honestly framed as representative.
10. **Final CTA band.** "Let's find your next move." Book a consultation plus a secondary "browse homes" link.
11. **Footer** with email capture.

### Buy `/buy`

1. **Search header.** Large search input, filter toggle, result count, sort dropdown.
2. **Filter rail.** Price, beds, baths, type, status, city, area, sort. Live, instant.
3. **Results grid.** Upgraded cards with save, quick contact, view count, days listed.
4. **Empty and loading states.** Skeletons on load, helpful empty state with reset.
5. **Map toggle.** Optional map view of results (Phase 4 stretch, can be a styled static preview if interactive is heavy).

### Property detail `/buy/[slug]`

1. **Gallery hero.** Large image with thumbnail strip, fullscreen, video walkthrough tab, floor plan tab.
2. **Title and price block.** Price, status, address, days listed, view count, save and share actions.
3. **Specs bar.** Beds, baths, area, lot, type, year, energy rating if available.
4. **Two column body.**
   - Left: description, features, amenities, nearby places (schools, hospitals, shopping, transit), property history, floor plan.
   - Right (sticky): agent card, mortgage calculator, "Schedule a viewing" button, "Instant inquiry" button, brochure download, share, save.
5. **Similar properties.** Three to four cards.
6. **Recently viewed.** If returning.
7. **Sticky bottom mobile bar.** Inquire · Schedule viewing.

### Sell `/sell`

1. **Hero.** "Sell with confidence." Subhead. Primary CTA: Get a valuation. Secondary: See how we sell.
2. **What your home could be worth.** Teaser for the valuation flow.
3. **How we sell.** Four steps. Photography, pricing, marketing, closing.
4. **What you get.** Pro photo, floor plan, listing on top portals, a dedicated agent, weekly updates.
5. **Case study.** One seller story.
6. **FAQ for sellers.** Six real questions.
7. **Final CTA.** Get a valuation.

### Sell valuation `/sell/valuation`

1. **Step header.** Progress indicator.
2. **Steps.** Address, property details (type, beds, baths, area, condition), your details (name, email, phone), timeline. Realistic estimate range shown at the end using a simple model based on the demo data.
3. **Result screen.** Estimate range, what affects it, "talk to an agent" CTA, what happens next.

### Agents `/agents`

1. **Header.** "Meet the people who will get you home."
2. **Agent grid.** Photo, name, title, specialty, number of listings, a one line note, "View profile".
3. **Team values strip.** How we work together.

### Agent profile `/agents/[slug]`

1. **Header.** Photo, name, title, specialty, contact buttons.
2. **About.** Bio, approach, specialties.
3. **Active listings.** Their properties.
4. **Sold.** Their sold properties (from demo data).
5. **Contact card.** Send a message, book a call.

### Insights `/insights`

1. **Header.** "Market insights, plain English."
2. **Featured article.** Large card.
3. **Article grid.** The rest.
4. **Email capture.** "Get the weekly market note."

### Insights article `/insights/[slug]`

1. **Header.** Title, author, date, read time.
2. **Body.** Full article, semantic HTML, real copy.
3. **Inline CTA.** Mid article, relevant.
4. **Related.** Two more articles.

### About `/about`

1. **Hero.** Who we are in one line.
2. **Story.** How Z0roCode started and what we believe.
3. **Values.** Four cards.
4. **Team teaser.** Link to agents.
5. **How we work.** Process summary.
6. **Contact CTA.**

### Contact `/contact`

1. **Header.** "Talk to a real person."
2. **Two column.** Left: contact form (name, email, phone, reason, message) with validation and spam protection. Right: office, phone, email, hours, map.
3. **Success state.** Animation and next steps.

### Client dashboard `/dashboard`

1. **Sidebar.** Saved, Viewed, Appointments, Messages, Profile.
2. **Saved properties.** Grid with remove and alert toggle.
3. **Recently viewed.** Compact list.
4. **Appointments.** Upcoming and past.
5. **Messages.** Thread with agent (simulated).

### Admin `/admin`

1. **Sidebar.** Overview, Properties, Leads, Appointments, Agents, Analytics.
2. **Overview.** Stat cards (leads this month, property views, pending approvals, upcoming appointments), recent leads table, recent activity.
3. **Properties.** Table with status, approval queue for seller submitted, edit, feature toggle.
4. **Leads.** Kanban or table by stage (new, contacted, consultation, client, won, lost).
5. **Appointments.** Calendar view and list.
6. **Agents.** List with performance.
7. **Analytics.** Traffic, conversion rate, lead sources, top properties. Demo data, clearly framed.

### Agent dashboard `/agent-dashboard`

1. **Sidebar.** My listings, Leads, Pipeline, Appointments, Clients.
2. **Overview.** My active listings, new leads, upcoming viewings, pipeline value.
3. **My listings.** Manage, view performance.
4. **Leads.** Assigned to me.
5. **Pipeline.** Sales stage board.

---

## 4. Content hierarchy (heading structure)

Each page has exactly one H1. Sections use H2. Subsections use H3. This is both for clarity and SEO.

**Homepage**
- H1: Find a place you'll love to call home.
- H2: Featured homes, Why Z0roCode, How it works, Buying or selling, Meet the team, Market insights, What our clients say, Ready when you are.

**Buy**
- H1: Browse every home we represent.
- H2: (dynamic) Filters, Results.

**Property detail**
- H1: [Property title]
- H2: About this home, Features and amenities, Location and nearby, Property history, Similar homes, Recently viewed.

**Sell**
- H1: Sell with confidence, not guesswork.
- H2: What your home could be worth, How we sell, What you get, A recent sale, Seller questions, Start your valuation.

**Agents**
- H1: Meet the people who'll get you home.
- H2: How we work as a team.

**Insights**
- H1: Market insights, plain English.
- H2: Latest, By topic.

**About**
- H1: We're Z0roCode. We help people move well.
- H2: Our story, What we believe, How we work, Meet the team.

**Contact**
- H1: Talk to a real person.

Every H1 contains a primary keyword and reads like a sentence. Every H2 is a benefit or a topic, never a label like "Section 3".

---

## 5. CTA strategy

### The CTA inventory

| CTA copy | What it triggers | Where it appears |
|---|---|---|
| Book a consultation | Opens booking modal (date, time, type, contact) | Header, hero, final band, agent profiles, property detail |
| Browse homes | Links to `/buy` | Hero, nav, final band |
| Save this home | Opens sign-up modal (email only) if not signed in, else saves | Every property card and detail page |
| Schedule a viewing | Opens booking modal scoped to a property | Property detail, sticky mobile bar |
| Send inquiry | Submits inquiry form scoped to a property | Property detail |
| Get a valuation | Links to `/sell/valuation` | Sell page, seller journey card, nav |
| List your property | Opens the list a property modal | Nav, sell page, seller journey card |
| Download brochure | Downloads a one page PDF for the property | Property detail |
| Share | Native share sheet / copy link | Property card, detail page |
| Get the market note | Email capture for insights newsletter | Insights, footer |
| Start with buying | Links to `/buy` with buyer context | Journey card |
| Start with selling | Opens valuation flow | Journey card |
| Explore as demo user | Instant sign in for the portfolio reviewer | Sign in page, dashboards gate |

### The ladder mapping

Every CTA maps to a rung. A visitor can enter the ladder anywhere.

1. **Email only:** Save this home, Get the market note, Get price drop alerts.
2. **Email and phone:** Schedule a viewing, Book a consultation.
3. **Full message:** Send inquiry, Contact form.
4. **Full flow:** List your property, Get a valuation.

We never ask for the full flow from someone who has not given us an email. Save and alert CTAs are the gentle front door.

### Modal vs page decisions

- **Onboarding (sign up):** Modal. Triggered from header, save actions, and journey cards. Fast, low friction, no context switch.
- **List a property:** Modal multi step. Triggered from nav and sell page. Premium feel, stays in context.
- **Book a consultation:** Modal with a calendar. Triggered from many places. One tap from anywhere to a human.
- **Property detail:** Real page. Shareable and indexable. Not a modal.
- **Valuation:** Real page `/sell/valuation`. It is a distinct journey worth its own URL.
- **Dashboards:** Real pages. They are destinations, not interruptions.

### Spam and safety on every form

- Honeypot field hidden from users.
- Server side rate limiting per IP.
- Zod validation on every endpoint, client and server.
- No raw HTML rendered from input.
- No API keys on the client.
- Every write endpoint checks auth where appropriate (admin and agent routes).

### What every CTA does after submit

For every form, the same four things happen, honestly:
1. Data is validated and stored in the right table.
2. A `Notification` row is created (this stands in for an email in the demo).
3. The admin or assigned agent is notified (visible in the admin lead board).
4. The user sees a success animation and a clear "what happens next" panel.

The README will state plainly that emails are logged, not sent, and that this is the only demo simplification in the flow.

---

## What happens next

This phase is structure only. No code written. Nothing pushed to GitHub.

If you approve this sitemap, navigation, page hierarchy and CTA strategy, Phase 3 will redesign the homepage in extreme detail: every section's copy, layout, interactions, animations, forms and CTA behavior, ready to build.

Tell me what to change, or give me the green light for Phase 3.
