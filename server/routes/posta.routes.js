import { Router } from 'express';
import { getPostas, getPosta, postPosta, updatePosta } from '../controllers/posta.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/postas', verifyToken, getPostas);
router.get('/postas/:id', verifyToken, getPosta);
router.post('/postas', verifyToken, isAdmin, postPosta);
router.put('/postas/:id', verifyToken, isAdmin, updatePosta);
router.delete('/postas/:id', verifyToken, isAdmin);

export default router;