import { Request, Response } from 'express'
import pool from '../db'

export const getPlayers = async (req: Request, res: Response) => {
  const { position, country, search } = req.query

  // Build query dynamically based on filters provided
  const conditions: string[] = []
  const values: any[] = []
  let paramCount = 1

  if (position) {
    conditions.push(`position = $${paramCount}`)
    values.push(position)
    paramCount++
  }

  if (country) {
    conditions.push(`country ILIKE $${paramCount}`)
    values.push(country)
    paramCount++
  }

  if (search) {
    conditions.push(`name ILIKE $${paramCount}`)
    values.push(`%${search}%`)
    paramCount++
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  try {
    const result = await pool.query(
      `SELECT id, api_player_id, name, position, country, price, is_injured
       FROM players
       ${where}
       ORDER BY price DESC`,
      values
    )

    res.json({
      count: result.rows.length,
      players: result.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}