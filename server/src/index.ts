import express from 'express'
import { config } from './config'
import pool from './db'
import authRouter from './routes/auth'
import teamRouter from './routes/team'


const app = express()
app.use(express.json())

app.use('/auth', authRouter);
app.use('/team', teamRouter);

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
