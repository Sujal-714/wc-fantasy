import { Router } from 'express'
import { extractStatsFromUrl, extractStatsAuto, submitMatchStats } from '../controllers/admin'
import { requireAdmin } from '../middleware/requireAdmin'
import { scoreMatches } from '../jobs/scoreMatches'

const router = Router()

router.use(requireAdmin)
router.post('/extract-stats-url', extractStatsFromUrl)
router.post('/extract-stats-auto', extractStatsAuto)
router.post('/matches/:matchId/stats', submitMatchStats)
router.post('/score', async (req, res) => {
  await scoreMatches()
  res.json({ message: 'Scoring job ran' })
})

export default router;