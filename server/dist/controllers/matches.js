"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matches = void 0;
const db_1 = __importDefault(require("../db"));
const matches = async (req, res) => {
    try {
        const result = await db_1.default.query(`SELECT id, api_match_id, home_team, away_team, 
              kickoff_at, status, matchday
       FROM matches
       ORDER BY kickoff_at ASC`);
        res.json({ matches: result.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.matches = matches;
