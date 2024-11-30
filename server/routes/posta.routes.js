import { Router } from 'express';
import { getPostas, getPosta, updatePosta } from '../controllers/posta.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/postas', verifyToken, getPostas);
router.get('/postas/:id', verifyToken, getPosta);
router.put('/postas/:id', verifyToken, isAdmin, updatePosta);

export default router;