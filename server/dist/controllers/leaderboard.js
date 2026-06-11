"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = void 0;
const db_1 = __importDefault(require("../db"));
const getLeaderboard = async (req, res) => {
    try {
        const result = await db_1.default.query(`SELECT 
     ROW_NUMBER() OVER (ORDER BY t.total_points DESC) AS rank,
     u.username,
     t.name AS team_name,
     t.total_points
   FROM teams t
   JOIN users u ON t.user_id = u.id
   ORDER BY t.total_points DESC
   LIMIT 100`);
        res.json({ leaderboard: result.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getLeaderboard = getLeaderboard;
