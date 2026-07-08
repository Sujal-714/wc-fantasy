import { Router } from 'express'
import { matches , getMyPoints} from '../controllers/matches'
import { authenticate } from '../middleware/auth'
const router = Router()


router.get('/', matches);
router.get('/:matchId/my-points', authenticate, getMyPoints)  

export default router