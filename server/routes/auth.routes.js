import { Router } from 'express';
import { login, logout, verify } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.get('/verify', verify);
router.post('/logout', logout);

export default router;