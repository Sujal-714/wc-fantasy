import pool from '../db'
import { calculatePoints } from '../utils/calculatePoints'


export const scoreMatches = async () => {
  console.log('Scoring job started...')

  const client = await pool.connect()

  try {
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
      await scoreMatch(client, match.id, match.api_match_id) // ✅ pass both
    }

    console.log('Scoring job complete')

  } catch (err) {
    console.error('Scoring job failed:', err)
  } finally {
    client.release()
  }
}

const scoreMatch = async (client: any, matchId: string, apiMatchId: number) => {
  const apiStats = await getMatchStats(apiMatchId)

  await client.query('BEGIN')

  try {
    for (const team of apiStats) {
      for (const playerData of team.players) {
        const s = playerData.statistics[0]

        const playerResult = await client.query(
          'SELECT id, position FROM players WHERE api_player_id = $1',
          [playerData.player.id]
        )

        if (playerResult.rows.length === 0) continue

        const player = playerResult.rows[0]

        const stats = {
          goals:            s.goals.total    || 0,
          assists:          s.goals.assists  || 0,
          minutes_played:   s.games.minutes  || 0,
          clean_sheet:      s.goals.conceded === 0 && s.games.minutes >= 60,
          yellow_cards:     s.cards.yellow   || 0,
          red_cards:        s.cards.red      || 0,
          penalties_missed: s.penalty.missed || 0,
          saves:            s.goals.saves    || 0,
        }

        const points = calculatePoints(stats, player.position)

        await client.query(
          `INSERT INTO player_match_stats 
             (player_id, match_id, goals, assists, minutes_played,
              clean_sheet, yellow_cards, red_cards, penalties_missed, saves, fantasy_points)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (player_id, match_id) DO NOTHING`,
          [player.id, matchId, stats.goals, stats.assists, stats.minutes_played,
           stats.clean_sheet, stats.yellow_cards, stats.red_cards,
           stats.penalties_missed, stats.saves, points]
        )
      }
    }

    await client.query(
      `UPDATE teams t SET total_points = (
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