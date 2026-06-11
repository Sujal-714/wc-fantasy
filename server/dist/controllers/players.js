"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayers = void 0;
const db_1 = __importDefault(require("../db"));
const getPlayers = async (req, res) => {
    const { position, country, search } = req.query;
    // Build query dynamically based on filters provided
    const conditions = [];
    const values = [];
    let paramCount = 1;
    if (position) {
        conditions.push(`position = $${paramCount}`);
        values.push(position);
        paramCount++;
    }
    if (country) {
        conditions.push(`country ILIKE $${paramCount}`);
        values.push(country);
        paramCount++;
    }
    if (search) {
        conditions.push(`name ILIKE $${paramCount}`);
        values.push(`%${search}%`);
        paramCount++;
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    try {
        const result = await db_1.default.query(`SELECT id, api_player_id, name, position, country, country_code, price, is_injured
       FROM players
       ${where}
       ORDER BY price DESC`, values);
        res.json({
            count: result.rows.length,
            players: result.rows
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getPlayers = getPlayers;
