"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const db_1 = __importDefault(require("./db"));
const node_cron_1 = __importDefault(require("node-cron"));
const auth_1 = __importDefault(require("./routes/auth"));
const team_1 = __importDefault(require("./routes/team"));
const players_1 = __importDefault(require("./routes/players"));
const transfer_1 = __importDefault(require("./routes/transfer"));
const scoreMatches_1 = require("./jobs/scoreMatches");
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const matches_1 = __importDefault(require("./routes/matches"));
const app = (0, express_1.default)();
// Enable CORS for all requests
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/team/transfer', transfer_1.default);
app.use('/team', team_1.default);
app.use('/players', players_1.default);
app.use('/leaderboard', leaderboard_1.default);
app.use('/matches', matches_1.default);
//Runs every day at 11pm 
node_cron_1.default.schedule('0 23 * * *', async () => {
    await (0, scoreMatches_1.scoreMatches)();
});
app.post('/admin/score', async (req, res) => {
    await (0, scoreMatches_1.scoreMatches)();
    res.json({ message: 'Scoring job ran' });
});
app.get('/health', async (req, res) => {
    try {
        await db_1.default.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected' });
    }
    catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected' });
    }
});
app.listen(config_1.config.port, () => {
    console.log(`Server running on port ${config_1.config.port}`);
});
