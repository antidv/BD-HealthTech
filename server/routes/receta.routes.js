// routes/receta.routes.js
import { Router } from 'express';
import {
  getEnfermedades,
  getMedicamentos,
  postDiagnostico
} from '../controllers/receta.controller.js';
import { verifyToken, isMedico } from '../libs/auth.middleware.js';

const router = Router();

router.get('/enfermedades', verifyToken, getEnfermedades);
router.get('/medicamentos', verifyToken, getMedicamentos);
router.post('/diagnostico/:idcita', verifyToken, isMedico, postDiagnostico);

export default router;
