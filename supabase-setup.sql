-- ============================================================================
-- Z0roCode Estates — Full database setup (tables + seed data)
-- Paste this into Supabase SQL Editor and click Run.
-- This creates every table the app needs and fills it with demo data.
-- ============================================================================

-- Clean slate (safe to re-run)
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Appointment" CASCADE;
DROP TABLE IF EXISTS "SavedProperty" CASCADE;
DROP TABLE IF EXISTS "Inquiry" CASCADE;
DROP TABLE IF EXISTS "Lead" CASCADE;
DROP TABLE IF EXISTS "Property" CASCADE;
DROP TABLE IF EXISTS "Agent" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ============================================================================
-- TABLES (names must match Prisma model names exactly)
-- ============================================================================

CREATE TABLE "Agent" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "specialty" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "photo" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "focusAreas" TEXT NOT NULL DEFAULT '[]',
  "soldCount" INTEGER NOT NULL DEFAULT 0,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "slug" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Property" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "bedrooms" INTEGER NOT NULL,
  "bathrooms" DOUBLE PRECISION NOT NULL,
  "sqft" INTEGER NOT NULL,
  "lotSize" DOUBLE PRECISION,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zip" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "yearBuilt" INTEGER,
  "energyRating" TEXT,
  "images" TEXT NOT NULL,
  "features" TEXT NOT NULL,
  "amenities" TEXT NOT NULL DEFAULT '[]',
  "nearby" TEXT NOT NULL DEFAULT '{}',
  "history" TEXT NOT NULL DEFAULT '[]',
  "agentId" TEXT REFERENCES "Agent"("id") ON DELETE SET NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "approved" BOOLEAN NOT NULL DEFAULT true,
  "views" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "phone" TEXT,
  "role" TEXT NOT NULL DEFAULT 'client',
  "intent" TEXT,
  "budget" INTEGER,
  "preferredCity" TEXT,
  "timeline" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavedProperty" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
  "alertOn" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SavedProperty_userId_propertyId_key" UNIQUE ("userId", "propertyId")
);

CREATE TABLE "Inquiry" (
  "id" TEXT PRIMARY KEY,
  "propertyId" TEXT REFERENCES "Property"("id") ON DELETE SET NULL,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "agentId" TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'contact',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Lead" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "intent" TEXT,
  "budget" INTEGER,
  "city" TEXT,
  "timeline" TEXT,
  "source" TEXT NOT NULL DEFAULT 'homepage',
  "stage" TEXT NOT NULL DEFAULT 'new',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "propertyId" TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Notification" (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "refType" TEXT,
  "refId" TEXT,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE INDEX "Property_type_idx" ON "Property"("type");
CREATE INDEX "Property_status_idx" ON "Property"("status");
CREATE INDEX "Property_price_idx" ON "Property"("price");
CREATE INDEX "Property_bedrooms_idx" ON "Property"("bedrooms");
CREATE INDEX "Property_featured_idx" ON "Property"("featured");
CREATE INDEX "Property_approved_idx" ON "Property"("approved");
CREATE INDEX "Agent_city_idx" ON "Agent"("city");
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- ============================================================================
-- SEED DATA: AGENTS
-- ============================================================================

INSERT INTO "Agent" ("id", "name", "title", "specialty", "bio", "email", "phone", "photo", "city", "focusAreas", "soldCount", "rating", "slug") VALUES
('agent-elena', 'Elena Vasquez', 'Senior Buyer''s Agent', 'Austin''s neighborhoods, memorized.', 'Elena has helped over 300 families find their footing in Austin over the last decade. She knows which streets flood, which schools feed where, and which homes are fairly priced the moment they hit the market. She treats every buyer like family, which means she is honest when a home is not the one.', 'elena@z0rocode.com', '(512) 555-0142', 'https://sfile.chatglm.cn/images-ppt/888e2f600ce4.jpg', 'Austin', '["Barton Hills","Zilker","Cherrywood","Mueller"]', 312, 4.9, 'elena-vasquez'),
('agent-marcus', 'Marcus Chen', 'Luxury Specialist', 'Homes over $2M, handled with care.', 'Marcus specializes in luxury and waterfront properties across Miami and the West Coast. Before real estate he ran a design studio, so he reads a home the way an architect does. His clients value discretion, and he delivers it. Every detail of a high-end transaction, from staging to closing, is handled quietly and well.', 'marcus@z0rocode.com', '(415) 555-0188', 'https://sfile.chatglm.cn/images-ppt/b1dce3f9ed9b.jpg', 'Miami', '["Miami Beach","Waterfront","Luxury Condos","Hillsborough"]', 184, 5.0, 'marcus-chen'),
('agent-priya', 'Priya Patel', 'Listing Agent', 'Pricing that holds up under scrutiny.', 'Priya lists homes and sells them for the number she says she will. Her pricing is built on comps, condition, and current demand, never on wishful thinking. Sellers get a clear plan, weekly updates, and a negotiator who treats their equity like her own. She has listed and sold over 400 homes across Seattle and the Bay Area.', 'priya@z0rocode.com', '(206) 555-0173', 'https://sfile.chatglm.cn/images-ppt/27388b9df998.png', 'Seattle', '["Capitol Hill","Ballard","West Seattle","Bellevue"]', 406, 4.9, 'priya-patel'),
('agent-james', 'James O''Brien', 'First-Time Buyer Guide', 'Patient, clear, and on your side.', 'James works with first-time buyers, and he loves it. He knows the process feels overwhelming, so he slows it down and explains every step. No question is too small, no concern brushed off. By the time you close, you will understand exactly what you bought and why. Hundreds of first-time buyers have started their story with a call to James.', 'james@z0rocode.com', '(312) 555-0119', 'https://sfile.chatglm.cn/images-ppt/51ff1eb439c0.jpg', 'Chicago', '["Lincoln Park","Logan Square","River North","Pilsen"]', 258, 4.8, 'james-obrien'),
('agent-sofia', 'Sofia Romano', 'Investment Advisor', 'Numbers first, emotion second.', 'Sofia works with investors and second-home buyers who want a clear return story. She models cash flow, appreciation, and exit options before she ever shows a property. Her clients are disciplined, and so is she. If a deal does not pencil, she will say so. That honesty has built a referral business that keeps her busy year round.', 'sofia@z0rocode.com', '(305) 555-0166', 'https://sfile.chatglm.cn/images-ppt/27c842c69a3e.jpg', 'Nashville', '["12South","East Nashville","Germantown","Downtown"]', 201, 4.9, 'sofia-romano');

-- ============================================================================
-- SEED DATA: PROPERTIES (6 listings)
-- ============================================================================

INSERT INTO "Property" ("id", "slug", "title", "description", "price", "bedrooms", "bathrooms", "sqft", "lotSize", "address", "city", "state", "zip", "latitude", "longitude", "type", "status", "yearBuilt", "energyRating", "images", "features", "amenities", "nearby", "history", "agentId", "featured", "approved", "views", "createdAt") VALUES
('prop-1', 'modern-hillside-retreat-with-pool', 'Modern Hillside Retreat with Pool', 'Wake up to wide hilltop views every morning. This four-bedroom home is built for real life, with an open kitchen at the center, a living room that flows straight onto the deck, and a primary suite tucked away like a private retreat. A pool, a media room, and solar panels make the weekends easy and the bills small.', 1850000, 4, 3.5, 3650, 0.42, '2408 Ridgeline Dr', 'Austin', 'TX', '78704', 30.2549, -97.7891, 'House', 'For Sale', 2021, 'A', '["https://sfile.chatglm.cn/images-ppt/3c1d82ffa132.png","https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg","https://sfile.chatglm.cn/images-ppt/881392c04080.jpg","https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg","https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg","https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg","https://sfile.chatglm.cn/images-ppt/6e2b040b29ad.jpg"]', '["Hilltop views","Kitchen built for gathering","Primary suite wing","Media room","Swimming pool","Solar panels","2-car garage"]', '["Pool","Solar","Media room","EV charger","Smart home"]', '{"schools":["Barton Hills Elementary (9/10)","O. Henry Middle (8/10)"],"hospitals":["Seton Medical — 1.2 mi"],"shopping":["Zilker Market — 0.4 mi"],"transit":["Rapid 801 — 3 blocks"]}', '[{"date":"2026-06-15","event":"Listed for sale","price":1850000}]', 'agent-elena', true, true, 412, '2026-06-15'),

('prop-2', 'sunny-mission-district-condo', 'Sunny Mission District Condo', 'Morning coffee on your own south-facing patio. This ground-floor condo keeps the character of 1920s San Francisco with modern updates where it counts, a refreshed kitchen, two roomy bedrooms, and in-unit laundry. Step out to cafés, taquerias, and parks within a few blocks.', 899000, 2, 2, 1180, NULL, '744 Valencia St, Unit 1', 'San Francisco', 'CA', '94110', 37.7599, -122.4214, 'Condo', 'For Sale', 1924, 'C', '["https://sfile.chatglm.cn/images-ppt/121f2d37c8c2.jpg","https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg","https://sfile.chatglm.cn/images-ppt/881392c04080.jpg","https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg","https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg","https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg"]', '["Private patio","In-unit laundry","Dedicated parking","Updated kitchen","Walk to cafés","Pet friendly"]', '["Parking","Laundry","Storage","Pet friendly"]', '{"schools":["Marshall Elementary (8/10)"],"hospitals":["ZSFGH — 1.5 mi"],"shopping":["Valencia Corridor — 0.2 mi"],"transit":["BART 16th St — 0.5 mi"]}', '[{"date":"2026-06-20","event":"Listed for sale","price":899000}]', 'agent-marcus', false, true, 289, '2026-06-20'),

('prop-3', 'craftsman-bungalow-in-capitol-hill', 'Craftsman Bungalow in Capitol Hill', 'Real Craftsman character, lovingly kept. Original millwork, a cozy fireplace, and a flowing layout make this 1912 bungalow feel like home the moment you walk in. The finished basement adds a family room and fourth bedroom, and the fenced backyard is ready for summer evenings.', 1125000, 4, 2.5, 2480, 0.12, '518 12th Ave E', 'Seattle', 'WA', '98102', 47.6232, -122.3197, 'House', 'For Sale', 1912, 'D', '["https://sfile.chatglm.cn/images-ppt/fb823fa5177b.jpg","https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg","https://sfile.chatglm.cn/images-ppt/881392c04080.jpg","https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg","https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg","https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg"]', '["Original millwork","Wood-burning fireplace","Finished basement","Fenced yard","Detached garage","Walk to light rail"]', '["Fireplace","Garage","Garden","Basement"]', '{"schools":["Stevens Elementary (8/10)"],"hospitals":["Swedish — 1.1 mi"],"shopping":["Broadway Market — 0.3 mi"],"transit":["Light Rail — 0.4 mi"]}', '[{"date":"2026-06-10","event":"Listed for sale","price":1125000}]', 'agent-priya', true, true, 503, '2026-06-10'),

('prop-4', 'waterfront-modern-with-infinity-pool', 'Waterfront Modern with Infinity Pool', 'The bay is your backyard. Walls of glass slide open to a 60-foot infinity pool, so the view never leaves the frame. Six bedrooms, a summer kitchen, a wine room, and a private dock make this the kind of place you never want to leave.', 4250000, 6, 5.5, 6200, 0.55, '2280 Bay View Ln', 'Miami', 'FL', '33139', 25.7911, -80.1378, 'House', 'For Sale', 2019, 'A', '["https://sfile.chatglm.cn/images-ppt/adb69aa368c0.jpg","https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg","https://sfile.chatglm.cn/images-ppt/881392c04080.jpg","https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg","https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg","https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg","https://sfile.chatglm.cn/images-ppt/6e2b040b29ad.jpg"]', '["Bay frontage","60ft infinity pool","Summer kitchen","Wine room","Home theater","Private dock"]', '["Pool","Dock","Wine room","Theater","Smart home","Garage"]', '{"schools":["South Pointe Elementary (8/10)"],"hospitals":["Mount Sinai — 1.0 mi"],"shopping":["Lincoln Road — 1.2 mi"],"transit":["South Beach Local — 1 block"]}', '[{"date":"2026-06-05","event":"Listed for sale","price":4250000}]', 'agent-marcus', true, true, 731, '2026-06-05'),

('prop-5', 'penthouse-condo-with-skyline-views', 'Penthouse Condo with Skyline Views', 'Floor-to-ceiling windows on every wall, with downtown and mountain views that change with the light. The kitchen is sleek and modern, the primary bath feels like a spa, and a 400-square-foot terrace extends the living room outside. Two parking spaces included.', 1295000, 2, 2, 1720, NULL, '1430 Larimer St, PH 31', 'Denver', 'CO', '80202', 39.7495, -104.9923, 'Condo', 'For Sale', 2017, 'B', '["https://sfile.chatglm.cn/images-ppt/f5851648e8d1.jpg","https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg","https://sfile.chatglm.cn/images-ppt/881392c04080.jpg","https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg","https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg","https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg"]', '["Penthouse level","Skyline views","400 sqft terrace","Spa bath","2 parking spaces","Concierge"]', '["Concierge","Gym","Terrace","Parking","Doorman"]', '{"schools":["Steck Elementary (8/10)"],"hospitals":["Presbyterian — 1.8 mi"],"shopping":["Cherry Creek — 0.6 mi"],"transit":["Bus 10 — 1 block"]}', '[{"date":"2026-06-18","event":"Listed for sale","price":1295000}]', 'agent-sofia', true, true, 521, '2026-06-18'),

('prop-6', 'nashville-townhouse-with-roof-deck', 'Nashville Townhouse with Roof Deck', 'Two blocks from the bistros and boutiques of 12South. This three-bedroom townhouse has wide-plank floors, a gas fireplace, and a kitchen with a walk-in pantry. The primary suite takes the top floor, with a private roof deck for sunset drinks.', 829000, 3, 3.5, 2210, NULL, '2304 12th Ave S', 'Nashville', 'TN', '37204', 36.1349, -86.7856, 'Townhouse', 'For Sale', 2019, 'B', '["https://sfile.chatglm.cn/images-ppt/eb1153c193cb.jpg","https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg","https://sfile.chatglm.cn/images-ppt/881392c04080.jpg","https://sfile.chatglm.cn/images-ppt/88f1e9e540ba.jpg","https://sfile.chatglm.cn/images-ppt/c90d987b5765.jpg","https://sfile.chatglm.cn/images-ppt/0fc5c25398e8.jpg"]', '["Roof deck","Gas fireplace","Walk-in pantry","Media room","Custom closets","Attached garage"]', '["Roof deck","Garage","Fireplace","Media room"]', '{"schools":["Glendale Elementary (8/10)"],"hospitals":["Vanderbilt — 2.1 mi"],"shopping":["12South — 0.1 mi"],"transit":["Bus 17 — 1 block"]}', '[{"date":"2026-06-22","event":"Listed for sale","price":829000}]', 'agent-sofia', true, true, 345, '2026-06-22');

-- ============================================================================
-- SEED DATA: SAMPLE LEADS
-- ============================================================================

INSERT INTO "Lead" ("id", "name", "email", "phone", "intent", "budget", "city", "timeline", "source", "stage", "createdAt") VALUES
('lead-1', 'Jordan Avery', 'jordan.avery@example.com', '(555) 555-0199', 'buying', 400000, 'Austin', '1-3 months', 'homepage', 'new', NOW() - INTERVAL '2 days'),
('lead-2', 'Riley Thompson', 'riley.thompson@example.com', '(555) 555-0188', 'selling', 650000, 'Denver', '3-6 months', 'valuation', 'contacted', NOW() - INTERVAL '4 days'),
('lead-3', 'Casey Brooks', 'casey.brooks@example.com', '(555) 555-0177', 'buying', 900000, 'Seattle', '6+ months', 'signup', 'consultation', NOW() - INTERVAL '6 days'),
('lead-4', 'Morgan Lee', 'morgan.lee@example.com', '(555) 555-0166', 'selling', 1300000, 'Miami', 'ASAP', 'contact', 'client', NOW() - INTERVAL '8 days');

-- ============================================================================
-- SEED DATA: SAMPLE APPOINTMENTS
-- ============================================================================

INSERT INTO "Appointment" ("id", "name", "email", "phone", "date", "time", "type", "status", "createdAt") VALUES
('appt-1', 'Jordan Avery', 'jordan.avery@example.com', '(555) 555-0199', (CURRENT_DATE + INTERVAL '1 day')::TEXT, '10:00', 'video', 'confirmed', NOW()),
('appt-2', 'Riley Thompson', 'riley.thompson@example.com', '(555) 555-0188', (CURRENT_DATE + INTERVAL '2 days')::TEXT, '14:00', 'phone', 'confirmed', NOW());

-- ============================================================================
-- DONE
-- ============================================================================

SELECT 'Setup complete! 5 agents, 6 properties, 4 leads, 2 appointments created.' AS result;
