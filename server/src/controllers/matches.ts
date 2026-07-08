import { Request, Response } from 'express'
import pool from '../db'
import { AuthRequest } from '../middleware/auth'

export const matches = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, api_match_id, home_team, away_team, 
              kickoff_at, status, matchday
       FROM matches
       ORDER BY kickoff_at ASC`
    )
    res.json({ matches: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getMyPoints = async (req: AuthRequest, res: Response) => {
  const { matchId } = req.params
  const userId = req.userId

  try {
    const result = await pool.query(
      `SELECT 
         p.name, p.position, p.country,
         pms.goals, pms.assists, pms.minutes_played,
         pms.clean_sheet, pms.yellow_cards, pms.red_cards,
         pms.saves, pms.penalties_missed, pms.fantasy_points,
         tp.is_captain, tp.player_id
       FROM player_match_stats pms
       JOIN players p ON pms.player_id = p.id
       JOIN team_players tp ON tp.player_id = p.id
       JOIN teams t ON tp.team_id = t.id
       WHERE pms.match_id = $1
       AND t.user_id = $2
       ORDER BY pms.fantasy_points DESC`,
      [matchId, userId]
    )

    const totalPoints = result.rows.reduce((sum: number, r: any) => sum + r.fantasy_points, 0)
    res.json({ players: result.rows, totalPoints })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}