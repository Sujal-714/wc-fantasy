-- ============================================================
-- WC Fantasy App — Initial Schema
-- Run this once to set up all tables
-- ============================================================



-- ============================================================
-- USERS
-- One row per registered user
-- ============================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  username        VARCHAR(50)  NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ============================================================
-- PLAYERS
-- All WC 2026 squad players — seeded from API once before tournament
-- Never created by users
-- ============================================================
CREATE TYPE player_position AS ENUM ('GK', 'DEF', 'MID', 'FWD');

CREATE TABLE players (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  api_player_id   INTEGER       NOT NULL UNIQUE, -- ID from API-Football, used to match stat updates
  name            VARCHAR(100)  NOT NULL,
  position        player_position NOT NULL,
  country         VARCHAR(100)  NOT NULL,
  price           NUMERIC(5,1)  NOT NULL,        -- fantasy price in $100 budget system
  is_injured      BOOLEAN       NOT NULL DEFAULT FALSE,
  image_url       VARCHAR(500)
);


-- ============================================================
-- MATCHES
-- All 64 WC 2026 fixtures — seeded from API
-- matchday = round number (1=Group Stage MD1, 7=Final)
-- ============================================================
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'finished');

CREATE TABLE matches (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  api_match_id    INTEGER       NOT NULL UNIQUE, -- ID from API-Football
  matchday        INTEGER       NOT NULL,         -- round number, used to group fixtures
  home_team       VARCHAR(100)  NOT NULL,
  away_team       VARCHAR(100)  NOT NULL,
  kickoff_at      TIMESTAMPTZ   NOT NULL,         -- squad locks 1hr before this
  status          match_status  NOT NULL DEFAULT 'scheduled'
);


-- ============================================================
-- TEAMS
-- One fantasy team per user
-- budget_remaining decreases as players are bought
-- total_points updated by scoring job after each match
-- ============================================================
CREATE TABLE teams (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID          NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name              VARCHAR(100)  NOT NULL,
  budget_remaining  NUMERIC(5,1)  NOT NULL DEFAULT 100.0,
  total_points      INTEGER       NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- UNIQUE on user_id enforces one team per user at the DB level
-- ON DELETE CASCADE means if a user is deleted, their team is too


-- ============================================================
-- TEAM_PLAYERS
-- Which players are in which team
-- This is the core join table — every squad pick lives here
-- ============================================================
CREATE TABLE team_players (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         UUID          NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id       UUID          NOT NULL REFERENCES players(id),
  is_captain      BOOLEAN       NOT NULL DEFAULT FALSE,
  is_on_bench     BOOLEAN       NOT NULL DEFAULT FALSE, -- FALSE = starting XI
  purchase_price  NUMERIC(5,1)  NOT NULL,               -- price at time of purchase
                                                         -- used for refund: NOT current price

  -- A player can only appear once per team
  UNIQUE(team_id, player_id)
);


-- ============================================================
-- PLAYER_MATCH_STATS
-- One row per player per match — populated by cron job after each match
-- fantasy_points is calculated once and stored here
-- Leaderboard = SUM of fantasy_points for players in a user's team
-- ============================================================
CREATE TABLE player_match_stats (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id         UUID    NOT NULL REFERENCES players(id),
  match_id          UUID    NOT NULL REFERENCES matches(id),

  -- Raw stats from API
  goals             INTEGER NOT NULL DEFAULT 0,
  assists           INTEGER NOT NULL DEFAULT 0,
  minutes_played    INTEGER NOT NULL DEFAULT 0,
  clean_sheet       BOOLEAN NOT NULL DEFAULT FALSE,
  yellow_cards      INTEGER NOT NULL DEFAULT 0,
  red_cards         INTEGER NOT NULL DEFAULT 0,
  penalties_missed  INTEGER NOT NULL DEFAULT 0,

  -- Calculated by scoring job, stored so leaderboard reads are fast
  fantasy_points    INTEGER NOT NULL DEFAULT 0,

  -- One stat row per player per match — no duplicates
  UNIQUE(player_id, match_id)
);


-- ============================================================
-- INDEXES
-- Speed up the queries you'll run most often
-- ============================================================

-- Leaderboard query joins team_players → player_match_stats on player_id
CREATE INDEX idx_team_players_team_id   ON team_players(team_id);
CREATE INDEX idx_team_players_player_id ON team_players(player_id);

-- Scoring job looks up stats by match
CREATE INDEX idx_pms_match_id  ON player_match_stats(match_id);
CREATE INDEX idx_pms_player_id ON player_match_stats(player_id);

-- Squad lock check: find next match by kickoff_at
CREATE INDEX idx_matches_kickoff ON matches(kickoff_at);
CREATE INDEX idx_matches_status  ON matches(status);