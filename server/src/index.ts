import cors from 'cors';
import express from 'express'
import { config } from './config'
import pool from './db'
import cron from 'node-cron'
import authRouter from './routes/auth'
import teamRouter from './routes/team'
import playersRouter from './routes/players'
import transferRouter from './routes/transfer'
import { scoreMatches } from './jobs/scoreMatches' 
import leaderboardRouter from './routes/leaderboard'
import matchesRouter from './routes/matches'
import adminRouter from './routes/admin'

export const app = express()

// Enable CORS for all requests
app.use(cors({
  origin: [
    'https://wc-fantasy-navy.vercel.app',  // ← your Vercel URL
    'http://localhost:5173',
     'http://localhost:8080',         // ← local dev
  ],
  credentials: true,
}));

app.use(express.json())

app.use((req, res, next) => {
  console.log('incoming:', req.method, req.path)
  next()
})
app.use('/auth', authRouter);
app.use('/team/transfer', transferRouter);
app.use('/team', teamRouter);
app.use('/players', playersRouter);
app.use('/leaderboard', leaderboardRouter)
app.use('/matches', matchesRouter)
app.use('/admin', adminRouter)

//Runs every day at 11pm 
// cron.schedule('0 23 * * *', async () => {
//   await scoreMatches()
// })
cron.schedule('8 17 * * *', async () => {
  console.log('CRON FIRED — testing');
  await scoreMatches()
})



app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

if (require.main === module) {

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
}