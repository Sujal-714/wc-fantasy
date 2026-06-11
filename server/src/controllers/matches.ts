import { Request, Response } from 'express'
import pool from '../db'

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

