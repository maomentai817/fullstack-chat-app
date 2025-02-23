import express from 'express'
import { signupHandler, loginHandler, logoutHandler } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', signupHandler)
router.post('/login', loginHandler)
router.post('/logout', logoutHandler)

export default router