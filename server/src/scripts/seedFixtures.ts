import pool from '../db'

// All times are UTC
const fixtures = [
  // ── GROUP STAGE ─────────────────────────────────────────────────────────────

  // June 11
  { matchday: 'Group A - Matchday 1', home: 'Mexico',       away: 'South Africa',  kickoff: '2026-06-11T18:00:00Z' },
  { matchday: 'Group B - Matchday 1', home: 'Canada',       away: 'Switzerland',   kickoff: '2026-06-12T00:00:00Z' },

  // June 12
  { matchday: 'Group C - Matchday 1', home: 'Brazil',       away: 'Morocco',       kickoff: '2026-06-13T01:00:00Z' },
  { matchday: 'Group D - Matchday 1', home: 'USA',          away: 'Paraguay',      kickoff: '2026-06-13T07:00:00Z' },

  // June 13
  { matchday: 'Group E - Matchday 1', home: 'Germany',      away: 'Ivory Coast',   kickoff: '2026-06-14T01:00:00Z' },
  { matchday: 'Group F - Matchday 1', home: 'Netherlands',  away: 'Japan',         kickoff: '2026-06-14T02:00:00Z' },
  { matchday: 'Group A - Matchday 1', home: 'Czech Republic', away: 'South Korea', kickoff: '2026-06-14T22:00:00Z' },
  { matchday: 'Group B - Matchday 1', home: 'Qatar',        away: 'Bosnia',        kickoff: '2026-06-15T03:00:00Z' },

  // June 14
  { matchday: 'Group C - Matchday 1', home: 'Haiti',        away: 'Scotland',      kickoff: '2026-06-15T07:00:00Z' },
  { matchday: 'Group D - Matchday 1', home: 'Australia',    away: 'Turkey',        kickoff: '2026-06-15T10:00:00Z' },
  { matchday: 'Group G - Matchday 1', home: 'Belgium',      away: 'Egypt',         kickoff: '2026-06-15T17:00:00Z' },
  { matchday: 'Group H - Matchday 1', home: 'Spain',        away: 'Cabo Verde',    kickoff: '2026-06-15T20:00:00Z' },

  // June 15
  { matchday: 'Group I - Matchday 1', home: 'France',       away: 'Senegal',       kickoff: '2026-06-15T23:00:00Z' },
  { matchday: 'Group J - Matchday 1', home: 'Argentina',    away: 'Algeria',       kickoff: '2026-06-16T20:00:00Z' },
  { matchday: 'Group K - Matchday 1', home: 'Portugal',     away: 'Uzbekistan',    kickoff: '2026-06-16T23:00:00Z' },
  { matchday: 'Group L - Matchday 1', home: 'Ghana',        away: 'Panama',        kickoff: '2026-06-17T05:00:00Z' },

  // June 16
  { matchday: 'Group G - Matchday 1', home: 'Iran',         away: 'New Zealand',   kickoff: '2026-06-17T08:00:00Z' },
  { matchday: 'Group H - Matchday 1', home: 'Uruguay',      away: 'Saudi Arabia',  kickoff: '2026-06-17T17:00:00Z' },
  { matchday: 'Group I - Matchday 1', home: 'Norway',       away: 'Iraq',          kickoff: '2026-06-17T20:00:00Z' },
  { matchday: 'Group J - Matchday 1', home: 'Austria',      away: 'Jordan',        kickoff: '2026-06-17T23:00:00Z' },

  // June 17
  { matchday: 'Group K - Matchday 1', home: 'Colombia',     away: 'DR Congo',      kickoff: '2026-06-18T02:00:00Z' },
  { matchday: 'Group L - Matchday 1', home: 'England',      away: 'Croatia',       kickoff: '2026-06-18T20:00:00Z' },
  { matchday: 'Group E - Matchday 1', home: 'Ecuador',      away: 'Curacao',       kickoff: '2026-06-18T23:00:00Z' },
  { matchday: 'Group F - Matchday 1', home: 'Sweden',       away: 'Tunisia',       kickoff: '2026-06-19T02:00:00Z' },

  // June 18
  { matchday: 'Group A - Matchday 2', home: 'South Korea',  away: 'South Africa',  kickoff: '2026-06-19T17:00:00Z' },
  { matchday: 'Group B - Matchday 2', home: 'Switzerland',  away: 'Bosnia',        kickoff: '2026-06-19T20:00:00Z' },
  { matchday: 'Group C - Matchday 2', home: 'Brazil',       away: 'Haiti',         kickoff: '2026-06-19T23:00:00Z' },
  { matchday: 'Group D - Matchday 2', home: 'Turkey',       away: 'Paraguay',      kickoff: '2026-06-20T02:00:00Z' },

  // June 19
  { matchday: 'Group A - Matchday 2', home: 'Mexico',       away: 'Czech Republic',kickoff: '2026-06-20T05:00:00Z' },
  { matchday: 'Group B - Matchday 2', home: 'Canada',       away: 'Qatar',         kickoff: '2026-06-20T17:00:00Z' },
  { matchday: 'Group C - Matchday 2', home: 'Scotland',     away: 'Morocco',       kickoff: '2026-06-20T20:00:00Z' },
  { matchday: 'Group D - Matchday 2', home: 'USA',          away: 'Australia',     kickoff: '2026-06-20T23:00:00Z' },

  // June 20
  { matchday: 'Group E - Matchday 2', home: 'Germany',      away: 'Curacao',       kickoff: '2026-06-21T02:00:00Z' },
  { matchday: 'Group F - Matchday 2', home: 'Netherlands',  away: 'Sweden',        kickoff: '2026-06-21T17:00:00Z' },
  { matchday: 'Group G - Matchday 2', home: 'Belgium',      away: 'New Zealand',   kickoff: '2026-06-21T20:00:00Z' },
  { matchday: 'Group H - Matchday 2', home: 'Spain',        away: 'Saudi Arabia',  kickoff: '2026-06-21T23:00:00Z' },

  // June 21
  { matchday: 'Group E - Matchday 2', home: 'Ivory Coast',  away: 'Ecuador',       kickoff: '2026-06-22T02:00:00Z' },
  { matchday: 'Group F - Matchday 2', home: 'Japan',        away: 'Tunisia',       kickoff: '2026-06-22T17:00:00Z' },
  { matchday: 'Group I - Matchday 2', home: 'France',       away: 'Iraq',          kickoff: '2026-06-22T20:00:00Z' },
  { matchday: 'Group J - Matchday 2', home: 'Argentina',    away: 'Jordan',        kickoff: '2026-06-22T23:00:00Z' },

  // June 22
  { matchday: 'Group G - Matchday 2', home: 'Egypt',        away: 'Iran',          kickoff: '2026-06-23T02:00:00Z' },
  { matchday: 'Group H - Matchday 2', home: 'Uruguay',      away: 'Cabo Verde',    kickoff: '2026-06-23T17:00:00Z' },
  { matchday: 'Group K - Matchday 2', home: 'Portugal',     away: 'DR Congo',      kickoff: '2026-06-23T20:00:00Z' },
  { matchday: 'Group L - Matchday 2', home: 'England',      away: 'Ghana',         kickoff: '2026-06-23T23:00:00Z' },

  // June 23
  { matchday: 'Group I - Matchday 2', home: 'Senegal',      away: 'Norway',        kickoff: '2026-06-24T02:00:00Z' },
  { matchday: 'Group J - Matchday 2', home: 'Austria',      away: 'Algeria',       kickoff: '2026-06-24T17:00:00Z' },
  { matchday: 'Group K - Matchday 2', home: 'Colombia',     away: 'Uzbekistan',    kickoff: '2026-06-24T20:00:00Z' },
  { matchday: 'Group L - Matchday 2', home: 'Croatia',      away: 'Panama',        kickoff: '2026-06-24T23:00:00Z' },

  // June 24 — Last group stage matchday (simultaneous)
  { matchday: 'Group A - Matchday 3', home: 'South Africa', away: 'Czech Republic',kickoff: '2026-06-25T17:00:00Z' },
  { matchday: 'Group A - Matchday 3', home: 'Mexico',       away: 'South Korea',   kickoff: '2026-06-25T17:00:00Z' },
  { matchday: 'Group B - Matchday 3', home: 'Switzerland',  away: 'Canada',        kickoff: '2026-06-25T21:00:00Z' },
  { matchday: 'Group B - Matchday 3', home: 'Qatar',        away: 'Bosnia',        kickoff: '2026-06-25T21:00:00Z' },

  // June 25
  { matchday: 'Group C - Matchday 3', home: 'Brazil',       away: 'Scotland',      kickoff: '2026-06-26T01:00:00Z' },
  { matchday: 'Group C - Matchday 3', home: 'Morocco',      away: 'Haiti',         kickoff: '2026-06-26T01:00:00Z' },
  { matchday: 'Group D - Matchday 3', home: 'USA',          away: 'Turkey',        kickoff: '2026-06-26T21:00:00Z' },
  { matchday: 'Group D - Matchday 3', home: 'Paraguay',     away: 'Australia',     kickoff: '2026-06-26T21:00:00Z' },
  { matchday: 'Group E - Matchday 3', home: 'Germany',      away: 'Ecuador',       kickoff: '2026-06-27T01:00:00Z' },
  { matchday: 'Group E - Matchday 3', home: 'Ivory Coast',  away: 'Curacao',       kickoff: '2026-06-27T01:00:00Z' },

  // June 26
  { matchday: 'Group F - Matchday 3', home: 'Netherlands',  away: 'Tunisia',       kickoff: '2026-06-27T17:00:00Z' },
  { matchday: 'Group F - Matchday 3', home: 'Japan',        away: 'Sweden',        kickoff: '2026-06-27T17:00:00Z' },
  { matchday: 'Group G - Matchday 3', home: 'Belgium',      away: 'Iran',          kickoff: '2026-06-27T21:00:00Z' },
  { matchday: 'Group G - Matchday 3', home: 'Egypt',        away: 'New Zealand',   kickoff: '2026-06-27T21:00:00Z' },

  // June 27
  { matchday: 'Group H - Matchday 3', home: 'Spain',        away: 'Uruguay',       kickoff: '2026-06-28T01:00:00Z' },
  { matchday: 'Group H - Matchday 3', home: 'Saudi Arabia', away: 'Cabo Verde',    kickoff: '2026-06-28T01:00:00Z' },
  { matchday: 'Group I - Matchday 3', home: 'France',       away: 'Norway',        kickoff: '2026-06-28T17:00:00Z' },
  { matchday: 'Group I - Matchday 3', home: 'Senegal',      away: 'Iraq',          kickoff: '2026-06-28T17:00:00Z' },
  { matchday: 'Group J - Matchday 3', home: 'Argentina',    away: 'Austria',       kickoff: '2026-06-28T21:00:00Z' },
  { matchday: 'Group J - Matchday 3', home: 'Algeria',      away: 'Jordan',        kickoff: '2026-06-28T21:00:00Z' },
  { matchday: 'Group K - Matchday 3', home: 'Portugal',     away: 'Colombia',      kickoff: '2026-06-29T01:00:00Z' },
  { matchday: 'Group K - Matchday 3', home: 'Uzbekistan',   away: 'DR Congo',      kickoff: '2026-06-29T01:00:00Z' },
  { matchday: 'Group L - Matchday 3', home: 'England',      away: 'Panama',        kickoff: '2026-06-29T17:00:00Z' },
  { matchday: 'Group L - Matchday 3', home: 'Croatia',      away: 'Ghana',         kickoff: '2026-06-29T17:00:00Z' },

  // ── KNOCKOUT STAGE ───────────────────────────────────────────────────────────
  // Round of 32 (TBD teams — placeholder names used)
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-06-29T21:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-06-30T01:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-06-30T17:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-06-30T21:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-01T01:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-01T17:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-01T21:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-02T01:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-02T17:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-02T21:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-03T01:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-03T17:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-03T21:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-04T01:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-04T17:00:00Z' },
  { matchday: 'Round of 32',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-04T21:00:00Z' },

  // Round of 16
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-05T17:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-05T21:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-06T17:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-06T21:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-07T17:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-07T21:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-08T17:00:00Z' },
  { matchday: 'Round of 16',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-08T21:00:00Z' },

  // Quarterfinals
  { matchday: 'Quarterfinal',         home: 'TBD',          away: 'TBD',           kickoff: '2026-07-10T17:00:00Z' },
  { matchday: 'Quarterfinal',         home: 'TBD',          away: 'TBD',           kickoff: '2026-07-10T21:00:00Z' },
  { matchday: 'Quarterfinal',         home: 'TBD',          away: 'TBD',           kickoff: '2026-07-11T17:00:00Z' },
  { matchday: 'Quarterfinal',         home: 'TBD',          away: 'TBD',           kickoff: '2026-07-11T21:00:00Z' },

  // Semifinals
  { matchday: 'Semifinal',            home: 'TBD',          away: 'TBD',           kickoff: '2026-07-14T21:00:00Z' },
  { matchday: 'Semifinal',            home: 'TBD',          away: 'TBD',           kickoff: '2026-07-15T21:00:00Z' },

  // Third place
  { matchday: 'Third Place',          home: 'TBD',          away: 'TBD',           kickoff: '2026-07-18T19:00:00Z' },

  // Final
  { matchday: 'Final',                home: 'TBD',          away: 'TBD',           kickoff: '2026-07-19T19:00:00Z' },
]

const seed = async () => {
  console.log(`Seeding ${fixtures.length} fixtures...`)

  for (const f of fixtures) {
    await pool.query(
      `INSERT INTO matches (matchday, home_team, away_team, kickoff_at, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [f.matchday, f.home, f.away, new Date(f.kickoff), 'scheduled']
    )
  }

  console.log('Done! Fixtures seeded.')
  await pool.end()
}

seed().catch(console.error)