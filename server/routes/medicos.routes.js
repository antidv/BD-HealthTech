import { Router } from 'express';
import { getMedicos, getMedico, postMedico, updateMedicos, deleteMedicos } from '../controllers/medicos.controller.js';
import { verifyToken, isAdmin } from '../controllers/auth.middleware.js';

const router = Router();

router.get('/medicos', verifyToken, isAdmin, getMedicos);
router.get('/medicos/:id', verifyToken, isAdmin, getMedico);
router.post('/medicos', verifyToken, isAdmin, postMedico);
router.put('/medicos/:id', verifyToken, isAdmin, updateMedicos);
router.delete('/medicos/:id', verifyToken, isAdmin, deleteMedicos);

export default router;