import { Router } from 'express'
import { matches } from '../controllers/matches'
const router = Router()


router.get('/', matches);

export default router