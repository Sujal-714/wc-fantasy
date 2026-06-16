import { Response } from 'express'
import pool from '../db'
import { AuthRequest } from '../middleware/auth'
import { calculatePoints } from '../utils/calculatePoints'
import { findMatchReportUrl, fetchArticleText, extractStats } from '../services/gemini'

// ── Extract stats from a pasted article URL ─────────────────
export const extractStatsFromUrl = async (req: AuthRequest, res: Response) => {
  const { matchId, url } = req.body

  if (!matchId || !url) {
    res.status(400).json({ error: 'matchId and url required' })
    return
  }

  try {
    const matchResult = await pool.query(
      'SELECT home_team, away_team FROM matches WHERE id = $1',
      [matchId]
    )
    if (matchResult.rows.length === 0) {
      res.status(404).json({ error: 'Match not found' })
      return
    }
    const { home_team, away_team } = matchResult.rows[0]

    const playersResult = await pool.query(
      'SELECT id, name FROM players WHERE country = $1 OR country = $2',
      [home_team, away_team]
    )
    const playerNames = playersResult.rows.map(p => p.name)

    const articleText = await fetchArticleText(url)
    const stats = await extractStats(articleText, playerNames)

    const statsWithIds = stats.map((s: any) => {
      const match = playersResult.rows.find(p => p.name === s.name)
      return match ? { ...s, player_id: match.id } : null
    }).filter(Boolean)

    res.json({ stats: statsWithIds, articlePreview: articleText.slice(0, 300) })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Extraction failed' })
  }
}

// ── Auto-find article + extract stats (no URL needed) ────────
export const extractStatsAuto = async (req: AuthRequest, res: Response) => {
  const { matchId } = req.body

  if (!matchId) {
    res.status(400).json({ error: 'matchId required' })
    return
  }

  try {
    const matchResult = await pool.query(
      'SELECT home_team, away_team, kickoff_at FROM matches WHERE id = $1',
      [matchId]
    )
    if (matchResult.rows.length === 0) {
      res.status(404).json({ error: 'Match not found' })
      return
    }
    const { home_team, away_team, kickoff_at } = matchResult.rows[0]
    const date = new Date(kickoff_at).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })

    // Step 1 — find the article automatically
    const url = await findMatchReportUrl(home_team, away_team, date)

    // Step 2 — fetch relevant players
    const playersResult = await pool.query(
      'SELECT id, name FROM players WHERE country = $1 OR country = $2',
      [home_team, away_team]
    )
    const playerNames = playersResult.rows.map(p => p.name)

    // Step 3 — fetch article text
    const articleText = await fetchArticleText(url)
    console.log('Article text length:', articleText.length)
console.log('Article preview:', articleText.slice(0, 500))

    // Step 4 — extract stats
    const stats = await extractStats(articleText, playerNames)

    const statsWithIds = stats.map((s: any) => {
      const match = playersResult.rows.find(p => p.name === s.name)
      return match ? { ...s, player_id: match.id } : null
    }).filter(Boolean)

    res.json({ stats: statsWithIds, sourceUrl: url })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Auto-extraction failed' })
  }
}

// ── Submit reviewed stats and trigger scoring ────────────────
export const submitMatchStats = async (req: AuthRequest, res: Response) => {
  const { matchId } = req.params
  const { stats } = req.body
  // stats = [{ player_id, goals, assists, minutes_played, clean_sheet, yellow_cards, red_cards, saves, penalties_missed }, ...]

  if (!stats || !Array.isArray(stats)) {
    res.status(400).json({ error: 'stats array required' })
    return
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const s of stats) {
      const playerResult = await client.query(
        'SELECT position FROM players WHERE id = $1',
        [s.player_id]
      )
      if (playerResult.rows.length === 0) continue
      const position = playerResult.rows[0].position

      const points = calculatePoints(s, position)

      await client.query(
        `INSERT INTO player_match_stats 
           (player_id, match_id, goals, assists, minutes_played, clean_sheet,
            yellow_cards, red_cards, penalties_missed, saves, fantasy_points)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (player_id, match_id) 
         DO UPDATE SET goals=$3, assists=$4, minutes_played=$5, clean_sheet=$6,
                        yellow_cards=$7, red_cards=$8, penalties_missed=$9, saves=$10, fantasy_points=$11`,
        [s.player_id, matchId, s.goals, s.assists, s.minutes_played, s.clean_sheet,
         s.yellow_cards, s.red_cards, s.penalties_missed, s.saves, points]
      )
    }

    await client.query(`UPDATE matches SET status = 'finished' WHERE id = $1`, [matchId])

    await client.query(
      `UPDATE teams t SET total_points = (
         SELECT COALESCE(SUM(pms.fantasy_points), 0)
         FROM team_players tp
         JOIN player_match_stats pms ON tp.player_id = pms.player_id
         WHERE tp.team_id = t.id
       )`
    )

    await client.query('COMMIT')
    res.json({ message: 'Stats submitted successfully' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  } finally {
    client.release()
  }
}