import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

// Extend Express's Request type to include userId
export interface AuthRequest extends Request {
  userId?: string
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Token comes in header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, config.jwt_secret) as { userId: string }
    req.userId = decoded.userId  // attach userId to request
    next()                       // move to the actual route handler
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}