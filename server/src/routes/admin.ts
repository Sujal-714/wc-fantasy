import { Router } from 'express'
import { extractStatsFromUrl, extractStatsAuto, submitMatchStats } from '../controllers/admin'
import { authenticate } from '../middleware/auth'
import { requireAdmin } from '../middleware/requireAdmin'

const router = Router()

router.use(requireAdmin)

router.post('/extract-stats-url', authenticate, extractStatsFromUrl)
router.post('/extract-stats-auto', authenticate, extractStatsAuto)
router.post('/matches/:matchId/stats', authenticate, submitMatchStats)

export default router