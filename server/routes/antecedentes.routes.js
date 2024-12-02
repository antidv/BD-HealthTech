import { Router } from 'express';
import { getAntecedentes, postAntecedentes, updateAntecedentes } from '../controllers/antecedentes.controller.js';
import { verifyToken, isPaciente, isMedico } from '../libs/auth.middleware.js';


const router = Router();

router.get('/antecedentes', verifyToken, isPaciente, getAntecedentes);
router.post('/antecedentes', verifyToken, isMedico, postAntecedentes);
router.put('/antecedentes', verifyToken, isMedico, updateAntecedentes);

export default router;