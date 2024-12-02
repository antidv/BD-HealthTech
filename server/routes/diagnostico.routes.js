// routes/diagnostico.routes.js
import { Router } from 'express';
import {
  getDiagnosticos,
  getDiagnostico,
  postDiagnosticoConRecetas,
  updateDiagnostico,
  deleteDiagnostico,
} from '../controllers/diagnostico.controller.js';
import { verifyToken, isAdmin, isMedico } from '../libs/auth.middleware.js';

const router = Router();

router.get('/diagnosticos', verifyToken, isAdmin, getDiagnosticos);
router.get('/diagnosticos/:id', verifyToken, isAdmin, getDiagnostico);
router.post('/diagnosticos/:idcita', verifyToken, isMedico, postDiagnosticoConRecetas);
router.put('/diagnosticos/:id', verifyToken, isAdmin, updateDiagnostico);
router.delete('/diagnosticos/:id', verifyToken, isAdmin, deleteDiagnostico);

export default router;
