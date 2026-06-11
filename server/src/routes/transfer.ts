import { Router } from 'express'
import { transferPlayer } from '../controllers/transfer'
import { authenticate } from '../middleware/auth'

const router = Router()

router.patch('/', authenticate, transferPlayer)

export default router