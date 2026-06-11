import pool from '../db'
import { calculatePoints } from '../utils/calculatePoints'

export const scoreMatches = async () => {
  console.log('Scoring job started...')

  const client = await pool.connect()

  try {
    // Find finished matches that have no stats yet
    const matchesResult = await client.query(
      `SELECT m.id, m.api_match_id
       FROM matches m
       WHERE m.status = 'finished'
       AND NOT EXISTS (
         SELECT 1 FROM player_match_stats pms WHERE pms.match_id = m.id
       )`
    )

    if (matchesResult.rows.length === 0) {
      console.log('No unscored matches found')
      return
    }

    console.log(`Found ${matchesResult.rows.length} unscored matches`)

    for (const match of matchesResult.rows) {
      await scoreMatch(client, match.id)
    }

    console.log('Scoring job complete')

  } catch (err) {
    console.error('Scoring job failed:', err)
  } finally {
    client.release()
  }
}

const scoreMatch = async (client: any, matchId: string) => {
  // Get all players whose country is playing in this match
  const match = await client.query(
    'SELECT home_team, away_team FROM matches WHERE id = $1',
    [matchId]
  )
  const { home_team, away_team } = match.rows[0]

  const playersResult = await client.query(
    `SELECT id, position FROM players
     WHERE country = $1 OR country = $2`,
    [home_team, away_team]
  )

  await client.query('BEGIN')

  try {
    for (const player of playersResult.rows) {
      // In production: fetch real stats from API-Football using player.api_player_id
      // For now: insert mock stats so you can test the scoring engine
      const mockStats = generateMockStats()
      const points = calculatePoints(mockStats, player.position)

      await client.query(
  `INSERT INTO player_match_stats 
     (player_id, match_id, goals, assists, minutes_played, 
      clean_sheet, yellow_cards, red_cards, penalties_missed, saves, fantasy_points)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
   ON CONFLICT (player_id, match_id) DO NOTHING`,
  [
    player.id, matchId,
    mockStats.goals, mockStats.assists, mockStats.minutes_played,
    mockStats.clean_sheet, mockStats.yellow_cards,
    mockStats.red_cards, mockStats.penalties_missed,
    mockStats.saves,    // ← new
    points
  ]
)
    }

    // Update total_points for every team that has players in this match
    await client.query(
      `UPDATE teams t
       SET total_points = (
         SELECT COALESCE(SUM(pms.fantasy_points), 0)
         FROM team_players tp
         JOIN player_match_stats pms ON tp.player_id = pms.player_id
         WHERE tp.team_id = t.id
       )`
    )

    await client.query('COMMIT')
    console.log(`Scored match ${matchId}`)

  } catch (err) {
    await client.query('ROLLBACK')
    console.error(`Failed to score match ${matchId}:`, err)
  }
}

// Mock stats for testing — replace with real API call later
const generateMockStats = () => ({
  goals:            Math.random() < 0.15 ? 1 : 0,
  assists:          Math.random() < 0.2  ? 1 : 0,
  minutes_played:   Math.random() < 0.8  ? 90 : Math.floor(Math.random() * 60),
  clean_sheet:      Math.random() < 0.3,
  yellow_cards:     Math.random() < 0.1  ? 1 : 0,
  red_cards:        Math.random() < 0.02 ? 1 : 0,
  penalties_missed: 0,
saves:            Math.floor(Math.random() * 8),
})