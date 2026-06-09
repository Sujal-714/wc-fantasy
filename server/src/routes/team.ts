import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createTeam } from '../controllers/team'
const router = Router()

router.post('/', authenticate, createTeam)

export default router