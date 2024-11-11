import { Router } from 'express';
import { getAntecedentes, postAntecedentes, updateAntecedentes } from '../controllers/antecedentes.controller.js';
import { verifyToken, isPaciente } from '../controllers/auth.middleware.js';


const router = Router();

router.get('/antecedentes', verifyToken, isPaciente, getAntecedentes);
router.post('/antecedentes', verifyToken, isPaciente, postAntecedentes);
router.put('/antecedentes', verifyToken, isPaciente, updateAntecedentes);

export default router;