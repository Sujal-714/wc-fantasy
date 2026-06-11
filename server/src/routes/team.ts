import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createTeam, getTeam } from '../controllers/team'
const router = Router()

router.post('/', authenticate, createTeam)
router.get('/',authenticate,getTeam)

export default router