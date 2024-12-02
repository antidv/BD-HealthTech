import { Router } from 'express';
import { getMedicos, getMedico, perfilMedico, postMedico, updateMedicos } from '../controllers/medicos.controller.js';
import { verifyToken, isAdmin, isMedico } from '../libs/auth.middleware.js';

const router = Router();

router.get('/medicos', verifyToken, isAdmin, getMedicos);
router.get('/medicos/perfil', verifyToken, isMedico, perfilMedico);
router.get('/medicos/:id', verifyToken, isAdmin, getMedico);
router.post('/medicos', verifyToken, isAdmin, postMedico);
router.put('/medicos/:id', verifyToken, isAdmin, updateMedicos);
router.delete('/medicos/:id', verifyToken, isAdmin);

export default router;