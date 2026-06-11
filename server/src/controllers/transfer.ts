import { Response } from 'express'
import pool from '../db'
import { AuthRequest } from '../middleware/auth'


export const transferPlayer = async (req: AuthRequest, res: Response) =>
    {
        const userId = req.userId;
        const { player_out_id,player_in_id} = req.body;
        
         if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (!player_out_id || !player_in_id) {
    res.status(400).json({ error: 'player_out_id and player_in_id are required' })
    return
  }

  if (player_out_id === player_in_id) {
    res.status(400).json({ error: 'player_out and player_in cannot be the same player' })
    return
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Step 1 — get user's team
    const teamResult = await client.query(
      'SELECT id, budget_remaining FROM teams WHERE user_id = $1',
      [userId]
    )
    if (teamResult.rows.length === 0) {
      res.status(404).json({ error: 'Team not found' })
      await client.query('ROLLBACK')
      return
    }
    const team = teamResult.rows[0]

    // Step 2 — find player_out in this team
    const playerOutResult = await client.query(
      `SELECT tp.purchase_price, tp.is_on_bench,tp.is_captain,
 p.position, p.name, p.is_injured
       FROM team_players tp
       JOIN players p ON tp.player_id = p.id
       WHERE tp.team_id = $1 AND tp.player_id = $2`,
      [team.id, player_out_id]
    )
     if (playerOutResult.rows.length === 0) {
      res.status(404).json({ error: 'Player to remove is not in your team' })
      await client.query('ROLLBACK')
      return
    }
     const playerOut = playerOutResult.rows[0]

      // Step 3 — calculate refund
    // Injured player → 80% refund, normal transfer → 70% refund
    const refundRate = playerOut.is_injured ? 0.8 : 0.7
    const refund = parseFloat((playerOut.purchase_price * refundRate).toFixed(1))

    // Step 4 — get player_in details
    const playerInResult = await client.query(
      'SELECT id, name, position, price FROM players WHERE id = $1',
      [player_in_id]
    )
    if (playerInResult.rows.length === 0) {
      res.status(404).json({ error: 'Player to add not found' })
      await client.query('ROLLBACK')
      return
    }
    const playerIn = playerInResult.rows[0]

    // Step 5 — position must match (FWD for FWD, GK for GK etc)
    if (playerOut.position !== playerIn.position) {
      res.status(400).json({
        error: `Position mismatch — removing ${playerOut.position}, incoming player is ${playerIn.position}`
      })
      await client.query('ROLLBACK')
      return
    }
    // Step 6 — check player_in not already in team
    const alreadyInTeam = await client.query(
      'SELECT id FROM team_players WHERE team_id = $1 AND player_id = $2',
      [team.id, player_in_id]
    )
    if (alreadyInTeam.rows.length > 0) {
      res.status(400).json({ error: 'Player is already in your team' })
      await client.query('ROLLBACK')
      return
    }

    // Step 7 — check budget
    const newBudget = parseFloat((parseFloat(team.budget_remaining) + refund - parseFloat(playerIn.price)).toFixed(1))
    if (newBudget < 0) {
      res.status(400).json({
        error: `Insufficient budget — refund: $${refund}, player costs: $${playerIn.price}, current budget: $${team.budget_remaining}`
      })
      await client.query('ROLLBACK')
      return
    }
      // Step 8 — do the swap inside transaction
    // Remove old player
    await client.query(
      'DELETE FROM team_players WHERE team_id = $1 AND player_id = $2',
      [team.id, player_out_id]
    )

    // Add new player — keep same bench status as the player they replaced
   await client.query(
  `INSERT INTO team_players (team_id, player_id, is_captain, is_on_bench, purchase_price)
   VALUES ($1, $2, $3, $4, $5)`,
  [team.id, player_in_id, playerOut.is_captain, playerOut.is_on_bench, playerIn.price]
)

    // Update budget
    await client.query(
      'UPDATE teams SET budget_remaining = $1 WHERE id = $2',
      [newBudget, team.id]
    )
       await client.query('COMMIT')

     res.json({
      message: 'Transfer successful',
      transferred: {
        out: playerOut.name,
        in: playerIn.name,
        refund,
        new_budget: newBudget
      }
    })

    
}catch(err){
await client.query('ROLLBACK')
console.error(err)
    res.status(500).json({ error: 'Server error' })
}finally{
    client.release()
}
    }