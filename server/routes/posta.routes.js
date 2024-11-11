import { Router } from 'express';
import { getPostas, getPosta, postPosta, updatePosta, deletePosta } from '../controllers/posta.controller.js';
import { verifyToken, isAdmin } from '../controllers/auth.middleware.js';

const router = Router();

router.get('/postas', verifyToken, getPostas);
router.get('/postas/:id', verifyToken, getPosta);
router.post('/postas', verifyToken, isAdmin, postPosta);
router.put('/postas/:id', verifyToken, isAdmin, updatePosta);
router.delete('/postas/:id', verifyToken, isAdmin, deletePosta);

export default router;