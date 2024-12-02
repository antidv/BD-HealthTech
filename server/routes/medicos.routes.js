import { Router } from 'express';
import { getMedicos, getMedico, perfilMedico, getMedicoConsultorio, postMedico, updateMedicos, updateMedicoDisponible } from '../controllers/medicos.controller.js';
import { verifyToken, isAdmin, isMedico } from '../libs/auth.middleware.js';

const router = Router();

router.get('/medicos', verifyToken, isAdmin, getMedicos);
router.get('/perfil_medico', verifyToken, isMedico, perfilMedico);
router.get('/medicos/:id', verifyToken, isAdmin, getMedico);
router.get('/medico-consultorio', verifyToken, isMedico, getMedicoConsultorio);
router.post('/medicos', verifyToken, isAdmin, postMedico);
router.put('/medicos/:id', verifyToken, isAdmin, updateMedicos);
router.put('/medicos-disponible/:id', verifyToken, isAdmin, updateMedicoDisponible);
router.delete('/medicos/:id', verifyToken, isAdmin);

export default router;