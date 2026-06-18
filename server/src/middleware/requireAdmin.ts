// src/middleware/requireAdmin.ts
import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  try {
    const decoded: any = jwt.verify(token, config.jwt_secret)

    if (!decoded.is_admin) {
      res.status(403).json({ error: 'Admin access only' })
      return
    }

    req.userId = decoded.userId
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}