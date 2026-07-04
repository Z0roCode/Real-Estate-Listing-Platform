# Phase 3 — Homepage Redesign in Detail

The homepage is the whole pitch in one scroll. Every section answers one question and ends in a clear next step. This document specifies copy, layout, interactions, animations, forms and CTA behavior for each, ready to build.

Design system tokens are locked at the end so every section shares one visual language.

---

## Section 1 — Hero

**Question it answers:** Who are we, what do we do, and what should I do next?

### Layout

Full viewport height on desktop (min-h-screen), shorter on mobile. A premium exterior photo fills the right 55% on desktop. The left 45% is a calm off-white panel with the copy. On mobile the photo becomes a full-bleed background with a dark gradient overlay and the copy sits on top.

A slim glass header floats above (see Section 0 below).

### Copy

Eyebrow: *Z0roCode Estates*

H1: **Find a place you'll love to call home.**

Subhead: *Handpicked homes, honest pricing, and a team that actually picks up the phone. Buying or selling, we make the move feel simple.*

Primary CTA: **Book a consultation** (opens booking modal)
Secondary CTA: **Browse homes** (links to /buy)

Trust line below the CTAs: *Trusted by 1,200+ families across 10 cities · In business since 2014*

Inline search bar under the trust line: a single input "Search by city, neighborhood, or address" with a search icon button. Submitting routes to /buy?q=...

### Interactions and animations

- On load, the copy panel fades and slides up in 600ms with a 100ms stagger between eyebrow, H1, subhead, CTAs, trust line, search.
- The hero image does a slow 20s Ken Burns zoom (scale 1 to 1.08) that respects `prefers-reduced-motion`.
- CTAs have a magnetic hover: the button drifts 4px toward the cursor on desktop only.
- The search input expands its focus ring smoothly and shows a dropdown of popular cities (Austin, Denver, Seattle, Miami, Nashville) on focus.
- On scroll, the hero parallaxes up at 0.7x speed as Section 2 covers it.

### Forms and CTAs

- "Book a consultation" opens the booking modal (Section 11 component, reused everywhere).
- "Browse homes" is a link to /buy.
- The search submits to /buy with the query string.

### Notes

The trust line uses numbers that are honest for a demo and framed as the agency's story, not a fake widget. "1,200+ families" and "since 2014" are presented as brand claims in the demo README, replaceable with real figures on launch. No star rating widget in the hero.

---

## Section 0 — Header (global, floats above hero)

### Layout

Sticky, transparent over the hero, turns to solid background with a hairline border after 40px of scroll. Max width container. Left: logo wordmark "Z0roCode Estates" with a small mark. Center/left: primary nav (Buy, Sell, Agents, Insights, About). Right: Saved (heart + count), Sign in, Book a consultation button.

Mobile: logo left, hamburger right. Sticky bottom bar appears after scrolling past the hero.

### Interactions

- Nav items underline on hover with a 200ms ease.
- Buy and Sell open mega dropdowns with a fade and 8px slide.
- The header background transitions from transparent to solid over 200ms on scroll.
- Saved count badge pops (scale 1.2 to 1) when a property is saved.
- Mobile hamburger opens a full-screen sheet sliding from the right.

---

## Section 2 — Trust bar

**Question:** Why trust us?

### Layout

A slim full-width band, four cells in a row (two by two on mobile). Each cell: a small icon, a big number, a short label. No star rating. No fake review count.

### Content

- 10+ years helping people move
- 1,200+ families settled
- $1.8B+ in closed sales
- 10 cities, one standard

### Interactions

- Numbers count up from zero when the section enters the viewport (IntersectionObserver), 1500ms ease-out. Respects reduced motion (shows final value instantly).
- Subtle hairline dividers between cells on desktop.

### Why this not the old version

The old trust strip had a fabricated "4.9 client rating" and "$1.2M median price" presented as real data. That breaks trust the moment a skeptic sees it. These four are framed as the agency's track record and clearly brand claims, which is honest for a portfolio demo. On a real launch the $1.8B and 1,200+ become real closed-sale figures.

---

## Section 3 — Featured listings

**Question:** What properties do we have?

### Layout

Section header row: left side has eyebrow "Featured homes" and H2 "A few homes we're proud to represent." Right side has a "View all homes" link with an arrow. Below: a responsive grid of six upgraded property cards (3 columns desktop, 2 tablet, 1 mobile). The first card can span 2 columns as a hero card on desktop for visual rhythm.

### The upgraded card (used everywhere, detailed in Phase 4)

Top: large image (4:3), status badge top-left, save heart top-right (fills on save), price bottom-left over a subtle gradient. Body: title (1 line), address (1 line), specs row (beds, baths, sqft with icons), then a footer row with agent avatar + name, days listed, and a "Quick tour" button. Hover: card lifts 4px, image zooms 1.05, a "View details" chevron appears.

### Interactions

- Cards stagger in (fade + 12px slide up) as the section enters, 80ms between cards.
- Save heart: clicking when signed in saves instantly with a tiny pop animation. Clicking when anonymous opens the sign-up modal pre-set to "saving this home."
- "Quick tour" opens the booking modal scoped to that property.
- Clicking the card body navigates to /buy/[slug].

### CTA

"View all homes" links to /buy.

---

## Section 4 — Why Z0roCode

**Question:** What makes you different?

### Layout

Two columns. Left: eyebrow "Why Z0roCode", H2 "We sweat the details other agencies skip.", a short paragraph, and a "See how it works" link to /about. Right: a 2x2 grid of four differentiator cards.

### Copy

H2: *We sweat the details other agencies skip.*

Paragraph: *Most agencies list a home and hope. We run a calm, transparent process that buyers and sellers actually understand. Here is what that looks like.*

Four cards:

1. **Process you can see.** Four clear steps from first call to keys. You always know what is happening and what happens next.
2. **Dual journey expertise.** We represent buyers and sellers with equal care. No side feels like an afterthought.
3. **Concierge communication.** A dedicated agent who picks up. Weekly updates. No chasing, no guessing.
4. **Data-backed pricing.** We price with comps and context, not vibes. You see the numbers behind the number.

### Interactions

- Cards fade and slide in on scroll with a stagger.
- On hover, the card's icon lifts slightly and the border tightens to the accent color.
- "See how it works" link has an arrow that nudges right on hover.

### Why this not the old version

The old value props ("real photos", "verified agents") are things every site claims. These four are actual differentiators that map to real buyer and seller anxieties. Each is a process promise, not an adjective.

---

## Section 5 — How it works

**Question:** How does your process work?

### Layout

Centered header: eyebrow "How it works", H2 "From first hello to front door.", subhead "A simple path, whether you're buying or selling." Below: a tab switcher with two tabs, Buying and Selling. Under the tabs: four step cards in a row with a connecting line between them. Switching tabs animates the cards.

### Copy

**Buying tab**
1. **Tell us what you want.** A 15-minute call to understand your budget, timeline, and the life you're moving toward.
2. **See the homes that fit.** We curate a shortlist, book tours, and flag things you'd miss.
3. **Make a strong offer.** We price the offer with data and negotiate hard on your behalf.
4. **Close and move in.** We handle inspections, paperwork, and deadlines. You get the keys.

**Selling tab**
1. **Get a clear valuation.** A real number based on comps, condition, and current demand.
2. **Prepare and list.** Pro photography, a floor plan, and a listing on every portal that matters.
3. **Market and negotiate.** Targeted campaigns, private showings, and skilled offer negotiation.
4. **Close and hand over.** Clean paperwork, a smooth escrow, and a check on time.

### Interactions

- Tab switch: the active tab underline slides, the step cards cross-fade (old cards fade out 150ms, new fade in 250ms).
- The connecting line between steps draws in left to right on first view.
- Each step number is a circle that fills with the accent on hover.

### CTA

Below the steps: "Book a consultation" (primary) and "See the full process" (link to /about).

---

## Section 6 — Buyer and seller journeys

**Question:** What if I'm buying? What if I'm selling?

### Layout

Two large side-by-side cards, equal width on desktop, stacked on mobile. Each card has a background image, a gradient overlay, a title, two lines of copy, and a primary CTA button.

### Copy

**Buying card**
Title: *I'm buying a home.*
Body: *Tell us your budget and your dream. We'll send you homes that actually fit and walk you through every step.*
CTA: **Start with buying** → /buy

**Selling card**
Title: *I'm selling my home.*
Body: *See what your home is worth and how we'd sell it. No pressure, no obligation, just a clear plan.*
CTA: **Get a valuation** → /sell/valuation

### Interactions

- On hover, the card image zooms 1.05 and the CTA arrow nudges right.
- Cards slide in from left and right respectively on scroll.

---

## Section 7 — Meet the agents

**Question:** Who will I work with?

### Layout

Section header: eyebrow "Meet the team", H2 "The people who'll get you home.", "Meet everyone" link to /agents. Below: a row of four agent cards (2x2 on mobile). Each card: a portrait photo, name, title, one-line specialty, and a small "View profile" link.

### Content

- Elena Vasquez — Senior Buyer's Agent — *Austin's neighborhoods, memorized.*
- Marcus Chen — Luxury Specialist — *Homes over $2M, handled with care.*
- Priya Patel — Listing Agent — *Pricing that holds up under scrutiny.*
- James O'Brien — First-Time Buyer Guide — *Patient, clear, and on your side.*

### Interactions

- Cards lift on hover, portrait desaturates slightly and returns to full color on hover.
- "View profile" links to /agents/[slug].

### Why this matters

Real faces build trust faster than any copy. Initials in a circle (the old version) feel anonymous. We will generate professional headshots for the demo agents.

---

## Section 8 — Market insights teaser

**Question:** Do they know their market?

### Layout

Section header: eyebrow "Market insights", H2 "What's happening in your market.", "Read all insights" link to /insights. Below: three article cards in a row. Each card: category tag, title, 2-line excerpt, author + date, read time. Below the cards: an email capture strip "Get the weekly market note. One email, every Sunday. No spam."

### Content (article titles)

- *What $800K buys in Austin right now* — Market
- *The 3 things that actually sell a home in 2025* — Selling
- *Mortgage rates just moved. Here's what it means for you.* — Finance

### Interactions

- Cards lift on hover, the category tag fills with accent.
- Email capture: inline input + button. On submit, validates email, shows a checkmark and "You're in. Check your inbox Sunday." Stores to the Lead table as a newsletter lead.

---

## Section 9 — Testimonials and case studies

**Question:** Can I see proof?

### Layout

Section header: eyebrow "Client stories", H2 "People we've helped move well." Below: a featured case study card (large, two columns: story text left, results right) plus two smaller testimonial cards below.

### Content

**Featured case study**
Title: *How we found the Chen family their forever home in 14 days.*
Body: *The Chens had been outbid three times. We rebuilt their offer strategy, found an off-market match in Barton Hills, and negotiated $40K under ask. They moved in before school started.*
Results: 14 days · $40K under ask · Barton Hills, Austin

**Testimonial 1**
*"They treated our sale like it was their own home. Every question answered the same day."* — Sarah & Tom, sold in Denver

**Testimonial 2**
*"As first-time buyers we were terrified. James made it feel doable from the first call."* — Maya R., bought in Seattle

### Honesty framing

A small line under the section: *Client stories are illustrative for this portfolio demo. Real client names and details are used on launch.*

### Interactions

- The featured card fades in with a subtle scale from 0.98.
- Testimonial cards slide up on scroll.

---

## Section 10 — Final CTA band

**Question:** What do I do now?

### Layout

Full-width band in the dark foreground color. Centered content: eyebrow "Ready when you are", H2 "Let's find your next move.", one line of copy, two CTAs side by side. Subtle animated background: a slow gradient shift or a faint property photo at low opacity.

### Copy

H2: *Let's find your next move.*
Body: *Book a free 30-minute consultation. We'll talk through where you are and where you want to be. No pressure, no scripts.*
Primary CTA: **Book a consultation** (opens booking modal)
Secondary CTA: **Browse homes** → /buy

### Interactions

- The background gradient slowly shifts hue over 20s.
- CTAs are larger here than elsewhere, with a soft glow on the primary.

---

## Section 11 — Global modals (reused across the homepage)

### Booking modal

Triggered by every "Book a consultation" and "Schedule a viewing" button.

**Steps:**
1. Choose a date (calendar grid, next 14 days, disables past and taken slots).
2. Choose a time (morning / afternoon / evening slots).
3. Choose type (Video call, Phone, In office).
4. Your details (name, email, phone). If signed in, pre-filled.
5. Confirm. Success screen with "What happens next."

**Behavior:**
- Progress indicator at top.
- Validates each step before next.
- On submit: creates an Appointment row, creates a Notification (stands in for email + calendar invite), notifies admin/agent, shows success animation with the reserved date/time and a "add to calendar" pseudo-button.
- Esc or backdrop click closes. State is preserved if reopened within the session.

### Sign-up / onboarding modal

Triggered by "Sign in", "Save this home" (when anonymous), and journey CTAs.

**Fields:** First name, last name, email, phone, "Are you buying or selling?" (toggle), preferred budget (select), preferred city (select), timeline (select).

**Behavior:**
- Single screen, not multi-step, to keep it fast. Grouped into two columns on desktop.
- Validates inline.
- On submit: creates a User and Lead row, creates a Notification, signs the user in (lightweight session), shows a success animation and "Nice to meet you, [first name]. Your saved homes and appointments live in your dashboard."
- If triggered from "Save this home," the save is applied automatically after sign-up.

### List a property modal

Triggered by "List your property" in nav and on the sell page.

**Steps (multi-step, premium feel):**
1. About you: owner name, email, phone.
2. Property basics: address, type, beds, baths, area, year built.
3. Pricing and timeline: expected price, selling timeline, condition notes.
4. Photos: image upload (multi, with preview thumbnails and drag to reorder).
5. Description: a textarea with a gentle character guide.
6. Review and submit.

**Behavior:**
- Progress bar at top.
- Validates per step, blocks next on errors.
- On submit: stores images, creates a Property in `pending` status, creates a Notification, notifies admin, shows success screen with "What happens next" (an agent will call within 1 business day to verify and finalize).

---

## Section 12 — Footer

### Layout

Dark foreground background. Four columns: Explore, Company, Sell, Get in touch. Each a list of links. Below the columns: an email capture row "Get the weekly market note" with input + button. Bottom: legal row (© 2026 Z0roCode Estates · A portfolio demo · Privacy · Terms · Fair Housing).

### Content

- Explore: Buy, Featured, Luxury, Open houses
- Company: About, Agents, Insights, Careers
- Sell: Get a valuation, List with us, Selling process
- Get in touch: phone, email, office address, social icons

### Interactions

- Links underline on hover.
- Email capture behaves like the insights capture.

---

## Global motion principles

- All motion uses ease-out curves, 150 to 600ms. Nothing bounces unless it is a deliberate success state.
- Every animation respects `prefers-reduced-motion`: entrances become instant fades, the Ken Burns stops, counters show final values.
- Scroll-triggered entrances use IntersectionObserver, fire once, with a 60px root margin so they trigger just before the element is fully visible.
- Page transitions (App Router) use a subtle 200ms fade. No slide between routes to keep navigation feeling instant.
- Magnetic buttons and parallax are desktop-only and disabled on touch and reduced-motion.

---

## Global responsive rules

- Container max width 1200px, 24px gutters on mobile, 32px on tablet, 48px on desktop.
- Type scale uses clamp() so headlines scale smoothly between mobile and desktop with no breakpoint jumps.
- All tap targets minimum 44x44px.
- Sticky mobile bottom bar (Search · Saved · Book a call) on homepage and /buy. Hidden on property detail where a different sticky bar takes over.
- No horizontal scroll at any width. Grids collapse 3 → 2 → 1.

---

## Locked design tokens

**Colors** (emerald accent on near-black and white, dark-mode ready)
- Background: white / oklch(0.145) in dark
- Foreground: oklch(0.18) / white in dark
- Primary (accent): emerald oklch(0.45 0.108 162.5)
- Primary foreground: white
- Muted: oklch(0.972) / oklch(0.269) in dark
- Muted foreground: oklch(0.52) / oklch(0.708) in dark
- Border: oklch(0.915) / white 10% in dark
- Card: white / oklch(0.205) in dark
- Success: emerald, Warning: amber, Error: red, unchanged from standard

**Typography**
- Display/Hero: clamp(2.5rem, 5vw, 4rem), weight 700, tracking tight, line-height 1.08
- H2: clamp(1.75rem, 3vw, 2.25rem), weight 700, tracking tight, line-height 1.15
- H3: 1.25rem, weight 600, line-height 1.3
- Body: 1rem (16px), weight 400, line-height 1.6
- Small/caption: 0.875rem, weight 500, muted
- Eyebrow: 0.75rem, weight 600, uppercase, tracking 0.12em, accent color
- Font family: Geist Sans (already loaded), Geist Mono for numerals in stats

**Spacing**
- Section vertical padding: 96px desktop, 64px mobile (clamp)
- Card padding: 24px mobile, 32px desktop
- Grid gaps: 24px mobile, 32px desktop

**Radius**
- Cards: 16px (var --radius-lg)
- Buttons and inputs: 10px
- Badges: 8px
- Pills: 999px

**Shadows**
- Card rest: `0 1px 2px rgba(0,0,0,0.04)`
- Card hover: `0 12px 32px rgba(0,0,0,0.08)`
- Modal: `0 24px 64px rgba(0,0,0,0.16)`

---

## Build order for Phase 3 implementation (after approval)

1. Lock the design tokens in globals.css and add the type/spacing utilities.
2. Build the global header and mobile bottom bar.
3. Build the reusable modal system (booking, sign-up, list-a-property) as standalone components.
4. Build the upgraded property card.
5. Build each homepage section as a component, top to bottom.
6. Assemble the homepage.
7. Verify with Agent Browser at 375, 768, 1440. Check reduced motion. Check that every CTA triggers its real action.

---

## What happens next

This phase is design only. No code written. Nothing pushed to GitHub.

If you approve this homepage design, Phase 4 redesigns the listings search, the upgraded property card, and the full property detail page, plus the backend logic for search, filtering, saving, and view tracking.

Tell me what to change, or give me the green light for Phase 4.
