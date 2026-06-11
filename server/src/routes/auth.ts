import { Router } from 'express'
import { register, login, updateUsername, updatePassword } from '../controllers/auth'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.patch('/user/username', authenticate, updateUsername)
router.patch('/user/password', authenticate, updatePassword)

export default router