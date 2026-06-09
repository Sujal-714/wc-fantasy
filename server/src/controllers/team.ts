import { Response } from 'express'
import pool from '../db'
import { AuthRequest } from '../middleware/auth'

export const createTeam = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const { name, players } = req.body

  // ── Basic validation ────────────────────────────────────
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (!name || !players || !Array.isArray(players)) {
    res.status(400).json({ error: 'Name and players are required' })
    return
  }

  if (players.length !== 15) {
    res.status(400).json({ error: 'A team must have exactly 15 players' })
    return
  }

  const captainCount = players.filter((p: any) => p.is_captain).length
  if (captainCount !== 1) {
    res.status(400).json({ error: 'Exactly 1 captain required' })
    return
  }

  // ── Fetch all 15 players in one query ───────────────────
  const playerIds = players.map((p: any) => p.player_id)
  const result = await pool.query(
    'SELECT id, price, position, country FROM players WHERE id = ANY($1)',
    [playerIds]
  )

  if (result.rows.length !== 15) {
    res.status(400).json({ error: 'One or more players not found' })
    return
  }

  const dbPlayers = result.rows

  // ── Budget check ────────────────────────────────────────
  const totalCost = dbPlayers.reduce((sum: number, p: any) => sum + parseFloat(p.price), 0)
  if (totalCost > 100) {
    res.status(400).json({ error: `Squad costs $${totalCost.toFixed(1)}, exceeds $100 budget` })
    return
  }

  // ── Position check ──────────────────────────────────────
  const positions: Record<string, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
  for (const p of dbPlayers) positions[p.position]++

  if (positions.GK !== 2 || positions.DEF !== 5 || positions.MID !== 5 || positions.FWD !== 3) {
    res.status(400).json({
      error: 'Invalid formation. Need 2 GK, 5 DEF, 5 MID, 3 FWD',
      current: positions
    })
    return
  }

  // ── Country limit check ─────────────────────────────────
  const countryCounts: Record<string, number> = {}
  for (const p of dbPlayers) {
    countryCounts[p.country] = (countryCounts[p.country] || 0) + 1
    if (countryCounts[p.country] > 3) {
      res.status(400).json({ error: `Max 3 players allowed from ${p.country}` })
      return
    }
  }

  // ── Transaction: insert team + team_players ─────────────
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Check user doesn't already have a team
    const existing = await client.query(
      'SELECT id FROM teams WHERE user_id = $1',
      [userId]
    )
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'You already have a team' })
      await client.query('ROLLBACK')
      return
    }

    // Insert into teams
    const budgetRemaining = parseFloat((100 - totalCost).toFixed(1))
    const teamResult = await client.query(
      `INSERT INTO teams (user_id, name, budget_remaining)
       VALUES ($1, $2, $3)
       RETURNING id, name, budget_remaining, total_points, created_at`,
      [userId, name, budgetRemaining]
    )
    const team = teamResult.rows[0]

    // Insert each player into team_players
    // We need purchase_price from dbPlayers matched to each selection
    const dbPlayerMap: Record<string, any> = {}
    for (const p of dbPlayers) dbPlayerMap[p.id] = p

    for (const selection of players) {
      const dbPlayer = dbPlayerMap[selection.player_id]
      await client.query(
        `INSERT INTO team_players (team_id, player_id, is_captain, is_on_bench, purchase_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          team.id,
          selection.player_id,
          selection.is_captain,
          selection.is_on_bench ?? false,
          dbPlayer.price          // purchase_price = price at time of buying
        ]
      )
    }

    await client.query('COMMIT')
    res.status(201).json({ team, playerCount: players.length })

  } catch (err: any) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  } finally {
    client.release()
  }
}