import {Router} from 'express'
import { getPlayers } from '../controllers/players'
const router = Router()

router.get('/', getPlayers)

export default router