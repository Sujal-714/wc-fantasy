import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db'
import { config } from '../config'


// ─── REGISTER ───────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  // Basic validation
  if (!email || !username || !password) {
    res.status(400).json({ error: 'Email, username and password required' })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' })
    return
  }

  try {
    // Hash the password — never store plain text
    // 10 = cost factor (how slow the hash is — slower = harder to brute force)
    const password_hash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, created_at`,
      [email, username, password_hash]
    )

    const user = result.rows[0]

    // Create JWT
    const token = jwt.sign(
      { userId: user.id },      // payload — what you want to store in the token
      config.jwt_secret,
      { expiresIn: '7d' }       // token expires in 7 days
    )

    res.status(201).json({ token, user })
  } catch (err: any) {
    // Postgres error code 23505 = unique constraint violation
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email or username already taken' })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// ─── LOGIN ──────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' })
    return
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    const user = result.rows[0]

    // Don't reveal whether email exists — always say "invalid credentials"
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Compare submitted password against stored hash
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { userId: user.id },
      config.jwt_secret,
      { expiresIn: '7d' }
    )

    // Never send password_hash back to client
    const { password_hash, ...safeUser } = user

    res.json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

