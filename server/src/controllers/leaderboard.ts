import { Request, Response } from 'express'
import pool from '../db'

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
  const result = await pool.query(
  `SELECT 
     ROW_NUMBER() OVER (ORDER BY t.total_points DESC) AS rank,
     u.username,
     t.name AS team_name,
     t.total_points
   FROM teams t
   JOIN users u ON t.user_id = u.id
   ORDER BY t.total_points DESC
   LIMIT 100`
)
    res.json({ leaderboard: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}