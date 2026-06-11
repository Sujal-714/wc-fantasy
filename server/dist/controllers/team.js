"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamName = exports.getTeam = exports.createTeam = void 0;
const db_1 = __importDefault(require("../db"));
const createTeam = async (req, res) => {
    const userId = req.userId;
    const { name, players } = req.body;
    // ── Basic validation ────────────────────────────────────
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!name || !players || !Array.isArray(players)) {
        res.status(400).json({ error: 'Name and players are required' });
        return;
    }
    if (players.length !== 15) {
        res.status(400).json({ error: 'A team must have exactly 15 players' });
        return;
    }
    const captainCount = players.filter((p) => p.is_captain).length;
    if (captainCount !== 1) {
        res.status(400).json({ error: 'Exactly 1 captain required' });
        return;
    }
    // ── Fetch all 15 players in one query ───────────────────
    const playerIds = players.map((p) => p.player_id);
    const result = await db_1.default.query('SELECT id, price, position, country FROM players WHERE id = ANY($1)', [playerIds]);
    if (result.rows.length !== 15) {
        res.status(400).json({ error: 'One or more players not found' });
        return;
    }
    const dbPlayers = result.rows;
    // ── Budget check ────────────────────────────────────────
    const totalCost = dbPlayers.reduce((sum, p) => sum + parseFloat(p.price), 0);
    if (totalCost > 100) {
        res.status(400).json({ error: `Squad costs $${totalCost.toFixed(1)}, exceeds $100 budget` });
        return;
    }
    // ── Position check ──────────────────────────────────────
    const positions = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    for (const p of dbPlayers)
        positions[p.position]++;
    if (positions.GK !== 2 || positions.DEF !== 5 || positions.MID !== 5 || positions.FWD !== 3) {
        res.status(400).json({
            error: 'Invalid formation. Need 2 GK, 5 DEF, 5 MID, 3 FWD',
            current: positions
        });
        return;
    }
    // ── Country limit check ─────────────────────────────────
    const countryCounts = {};
    for (const p of dbPlayers) {
        countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
        if (countryCounts[p.country] > 3) {
            res.status(400).json({ error: `Max 3 players allowed from ${p.country}` });
            return;
        }
    }
    // ── Transaction: insert team + team_players ─────────────
    const client = await db_1.default.connect();
    try {
        await client.query('BEGIN');
        // Check user doesn't already have a team
        const existing = await client.query('SELECT id FROM teams WHERE user_id = $1', [userId]);
        if (existing.rows.length > 0) {
            res.status(409).json({ error: 'You already have a team' });
            await client.query('ROLLBACK');
            return;
        }
        // Insert into teams
        const budgetRemaining = parseFloat((100 - totalCost).toFixed(1));
        const teamResult = await client.query(`INSERT INTO teams (user_id, name, budget_remaining)
       VALUES ($1, $2, $3)
       RETURNING id, name, budget_remaining, total_points, created_at`, [userId, name, budgetRemaining]);
        const team = teamResult.rows[0];
        // Insert each player into team_players
        // We need purchase_price from dbPlayers matched to each selection
        const dbPlayerMap = {};
        for (const p of dbPlayers)
            dbPlayerMap[p.id] = p;
        for (const selection of players) {
            const dbPlayer = dbPlayerMap[selection.player_id];
            await client.query(`INSERT INTO team_players (team_id, player_id, is_captain, is_on_bench, purchase_price)
         VALUES ($1, $2, $3, $4, $5)`, [
                team.id,
                selection.player_id,
                selection.is_captain,
                selection.is_on_bench ?? false,
                dbPlayer.price // purchase_price = price at time of buying
            ]);
        }
        await client.query('COMMIT');
        res.status(201).json({ team, playerCount: players.length });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
    finally {
        client.release();
    }
};
exports.createTeam = createTeam;
const getTeam = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const teamResult = await db_1.default.query(`SELECT id, name, budget_remaining, total_points, created_at
       FROM teams 
      WHERE user_id = $1`, [userId]);
        if (teamResult.rows.length === 0) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        const team = teamResult.rows[0];
        const playersResult = await db_1.default.query(`SELECT p.id AS player_id ,p.name,p.position,p.country,p.country_code,p.price,p.is_injured,tp.is_captain,tp.is_on_bench,tp.purchase_price
      FROM team_players tp
      JOIN  players p ON tp.player_id = p.id 
      WHERE  tp.team_id = $1`, [team.id]);
        const players = playersResult.rows;
        res.json({ team, players });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getTeam = getTeam;
const updateTeamName = async (req, res) => {
    const userId = req.userId;
    const { name } = req.body;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!name || !name.trim()) {
        res.status(400).json({ error: 'Team name cannot be empty' });
        return;
    }
    try {
        const result = await db_1.default.query(`UPDATE teams 
       SET name = $1 
       WHERE user_id = $2 
       RETURNING id, name, budget_remaining, total_points, created_at`, [name.trim(), userId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        res.json({ team: result.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateTeamName = updateTeamName;
