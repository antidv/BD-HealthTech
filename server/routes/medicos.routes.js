import { Router } from 'express';
import { getMedicos, getEspecialidades, getMedico, postMedico, updateMedicos } from '../controllers/medicos.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/medicos', verifyToken, isAdmin, getMedicos);
router.get('/especialidades', verifyToken, getEspecialidades);
router.get('/medicos/:id', verifyToken, isAdmin, getMedico);
router.post('/medicos', verifyToken, isAdmin, postMedico);
router.put('/medicos/:id', verifyToken, isAdmin, updateMedicos);
router.delete('/medicos/:id', verifyToken, isAdmin);

export default router;