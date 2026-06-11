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

const app = express()
app.use(express.json())

app.use('/auth', authRouter);
app.use('/team/transfer', transferRouter);
app.use('/team', teamRouter);
app.use('/players', playersRouter);
app.use('/leaderboard', leaderboardRouter)

//Runs every day at 11pm 
cron.schedule('0 23 * * *', async () => {
  await scoreMatches()
})

app.post('/admin/score', async (req, res) => {
  await scoreMatches()
  res.json({ message: 'Scoring job ran' })
})

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
