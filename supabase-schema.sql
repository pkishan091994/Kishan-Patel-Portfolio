-- ================================================================
-- Kishan Patel Portfolio — Supabase Schema
-- Run this SQL in your Supabase project via:
-- Dashboard → SQL Editor → New Query → paste & run
-- ================================================================

-- ── Profile ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id                BIGINT PRIMARY KEY DEFAULT 1,
  name              TEXT DEFAULT 'Kishan Patel',
  title             TEXT DEFAULT 'Mobile Application Developer',
  bio               TEXT,
  avatar_url        TEXT,
  email             TEXT,
  phone             TEXT,
  location          TEXT DEFAULT 'Gujarat, India',
  resume_url        TEXT,
  years_experience  INTEGER DEFAULT 8,
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Ensure only one profile row
CREATE UNIQUE INDEX IF NOT EXISTS profile_id_unique ON profile (id);

-- Seed default profile
INSERT INTO profile (id, name, title, bio, email, phone, location, years_experience)
VALUES (
  1,
  'Kishan Patel',
  'IT Mobile Application Developer',
  'Passionate IT Mobile Application Developer with 8+ years of experience crafting high-performance, user-centric mobile applications across Flutter, iOS (Swift), Android (Kotlin/Java), and React Native. Proven track record of delivering 30+ production apps across healthcare, e-commerce, fintech, and social domains.',
  'kishanpatel@email.com',
  '+91 98765 43210',
  'Gujarat, India',
  8
) ON CONFLICT (id) DO NOTHING;

-- ── Experience ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id           BIGSERIAL PRIMARY KEY,
  company      TEXT NOT NULL,
  role         TEXT NOT NULL,
  duration     TEXT,
  description  TEXT,
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

INSERT INTO experience (company, role, duration, description, order_index) VALUES
('TechSolution Pvt. Ltd.', 'Senior Mobile Developer', 'Jan 2021 – Present', 'Lead a team of 6 developers to architect and build cross-platform apps in Flutter. Delivered 10+ production apps. Established CI/CD pipelines using GitHub Actions and Fastlane. Reduced app crash rate by 40%.', 1),
('AppCraft Technologies', 'Mobile Application Developer', 'Jun 2018 – Dec 2020', 'Developed and maintained 15+ iOS and Android apps using Swift and Kotlin. Integrated RESTful APIs, Firebase, payment gateways (Razorpay, Stripe). Worked closely with UI/UX teams to implement pixel-perfect designs.', 2),
('Infoways Digital', 'Junior Android Developer', 'Aug 2016 – May 2018', 'Built Android applications from scratch using Java and later migrated codebases to Kotlin. Implemented real-time chat, push notifications, offline sync, and Google Maps integration.', 3)
ON CONFLICT DO NOTHING;

-- ── Skills ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL,
  proficiency  INTEGER DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

INSERT INTO skills (name, category, proficiency, order_index) VALUES
('Flutter / Dart', 'Cross-Platform', 98, 1),
('React Native', 'Cross-Platform', 85, 2),
('iOS (Swift)', 'Native', 90, 3),
('Android (Kotlin)', 'Native', 90, 4),
('Java (Android)', 'Native', 85, 5),
('Firebase', 'Backend / Cloud', 88, 6),
('REST APIs', 'Backend / Cloud', 92, 7),
('Supabase', 'Backend / Cloud', 80, 8),
('Git & GitHub', 'DevOps & Tools', 90, 9),
('CI/CD (Fastlane)', 'DevOps & Tools', 82, 10),
('App Store / Play Store', 'DevOps & Tools', 95, 11),
('Figma / UI/UX', 'Design & Tools', 75, 12)
ON CONFLICT DO NOTHING;

-- ── Projects ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  image_url       TEXT,
  tech_stack      TEXT[],
  app_store_url   TEXT,
  play_store_url  TEXT,
  github_url      TEXT,
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

INSERT INTO projects (title, description, tech_stack, app_store_url, play_store_url, order_index) VALUES
('HealthTrack Pro', 'Comprehensive health monitoring app with real-time analytics, HealthKit/Google Fit integration, and AI-driven insights. 50,000+ users.', ARRAY['Flutter','Firebase','HealthKit','ML Kit'], 'https://apps.apple.com', 'https://play.google.com', 1),
('ShopEase', 'Feature-rich e-commerce app with AR product preview, Stripe & Razorpay payment integration, and real-time inventory management.', ARRAY['React Native','Node.js','Stripe','AWS S3'], 'https://apps.apple.com', 'https://play.google.com', 2),
('CityComm', 'Real-time community platform with encrypted messaging, live video streams, and location-based discovery. 100,000+ downloads.', ARRAY['Swift','Kotlin','WebRTC','Socket.io'], 'https://apps.apple.com', 'https://play.google.com', 3)
ON CONFLICT DO NOTHING;

-- ── Education ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id           BIGSERIAL PRIMARY KEY,
  degree       TEXT NOT NULL,
  institution  TEXT,
  year         TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

INSERT INTO education (degree, institution, year, description) VALUES
('B.Tech in Computer Science', 'Gujarat Technological University', '2012–2016', 'Graduated with distinction. Specialized in software engineering and mobile computing.')
ON CONFLICT DO NOTHING;

-- ── Contact Links ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_links (
  id        BIGSERIAL PRIMARY KEY,
  platform  TEXT NOT NULL,
  url       TEXT NOT NULL,
  icon      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO contact_links (platform, url) VALUES
('LinkedIn', 'https://linkedin.com/in/kishanpatel'),
('GitHub', 'https://github.com/kishanpatel')
ON CONFLICT DO NOTHING;

-- ── Contact Messages (from contact form) ─────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- Row Level Security (RLS) — enable for public read access
-- ================================================================
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Public can read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public can read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can read education" ON education FOR SELECT USING (true);
CREATE POLICY "Public can read contact_links" ON contact_links FOR SELECT USING (true);

-- Public can insert contact messages (contact form)
CREATE POLICY "Public can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated (admin) can do everything
CREATE POLICY "Admin full access profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access education" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_links" ON contact_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- ================================================================
-- Done! Your database is ready.
-- ================================================================
