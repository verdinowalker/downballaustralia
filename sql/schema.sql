-- Supabase schema for Downball Australia

-- Users (managed by Supabase auth, but keep a profile table)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  display_name text,
  role text DEFAULT 'admin', -- admin, editor, viewer
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Articles / News
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text,
  content text,
  author_id uuid REFERENCES profiles(id),
  featured_image text,
  category text,
  status text DEFAULT 'draft', -- draft, published
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Competitions
CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo text,
  created_at timestamptz DEFAULT now()
);

-- Seasons
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  name text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Divisions
CREATE TABLE IF NOT EXISTS divisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo text,
  colours jsonb,
  coach text,
  country text,
  state text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Players
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  first_name text,
  last_name text,
  slug text UNIQUE,
  photo text,
  position text,
  number integer,
  height_cm integer,
  dob date,
  nationality text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- Venues
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  address text,
  city text,
  state text,
  country text,
  capacity integer,
  created_at timestamptz DEFAULT now()
);

-- Fixtures
CREATE TABLE IF NOT EXISTS fixtures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id),
  season_id uuid REFERENCES seasons(id),
  division_id uuid REFERENCES divisions(id),
  home_team_id uuid REFERENCES teams(id),
  away_team_id uuid REFERENCES teams(id),
  venue_id uuid REFERENCES venues(id),
  scheduled_at timestamptz,
  status text DEFAULT 'scheduled', -- scheduled, live, postponed, cancelled, finished
  created_at timestamptz DEFAULT now()
);

-- Results
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id uuid REFERENCES fixtures(id) ON DELETE CASCADE,
  home_score integer,
  away_score integer,
  status text DEFAULT 'final', -- final, provisional
  recorded_at timestamptz DEFAULT now()
);

-- Match events (live timeline)
CREATE TABLE IF NOT EXISTS match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id uuid REFERENCES fixtures(id) ON DELETE CASCADE,
  event_time integer, -- seconds or minute marker
  event_type text,
  description text,
  team_id uuid REFERENCES teams(id),
  player_id uuid REFERENCES players(id),
  created_at timestamptz DEFAULT now()
);

-- Team standings
CREATE TABLE IF NOT EXISTS team_standings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id),
  season_id uuid REFERENCES seasons(id),
  division_id uuid REFERENCES divisions(id),
  team_id uuid REFERENCES teams(id),
  played integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  draws integer DEFAULT 0,
  points_for integer DEFAULT 0,
  points_against integer DEFAULT 0,
  points integer DEFAULT 0,
  percentage numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Player statistics (per season)
CREATE TABLE IF NOT EXISTS player_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id),
  season_id uuid REFERENCES seasons(id),
  games_played integer DEFAULT 0,
  points integer DEFAULT 0,
  rebounds integer DEFAULT 0,
  assists integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Team statistics (per season)
CREATE TABLE IF NOT EXISTS team_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id),
  season_id uuid REFERENCES seasons(id),
  games_played integer DEFAULT 0,
  points_for integer DEFAULT 0,
  points_against integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Rankings (world and domestic)
CREATE TABLE IF NOT EXISTS rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text, -- team / country
  entity_id uuid,
  rank integer,
  previous_rank integer,
  points numeric,
  updated_at timestamptz DEFAULT now()
);

-- Tournaments / World Cups
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  slug text UNIQUE,
  type text, -- worldcup, knockout, cup
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Groups (for tournament group stage)
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  name text
);

-- Awards & records
CREATE TABLE IF NOT EXISTS awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  description text,
  season_id uuid REFERENCES seasons(id),
  player_id uuid REFERENCES players(id),
  team_id uuid REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  description text,
  value text,
  entity_type text,
  entity_id uuid
);

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  logo text,
  website text,
  tier text
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fixtures_scheduled_at ON fixtures(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- NOTE: Additional functions/triggers to update standings and stats will be provided in migrations or application logic.
