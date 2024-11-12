import express from 'express';
import { postMedicoPosta, getMedicoPostas, getMedicoPosta, updateMedicoPosta, deleteMedicoPosta } from '../controllers/medicoPosta.controller.js';
import { verifyToken, isAdmin } from '../controllers/auth.middleware.js';

const router = express.Router();

router.post('/medico-posta', verifyToken, isAdmin, postMedicoPosta);
router.get('/medico-posta', verifyToken, getMedicoPostas);
router.get('/medico-posta/:id', verifyToken, getMedicoPosta);
router.put('/medico-posta/:id', verifyToken, isAdmin, updateMedicoPosta);
router.delete('/medico-posta/:id', verifyToken, isAdmin, deleteMedicoPosta);

export default router;
