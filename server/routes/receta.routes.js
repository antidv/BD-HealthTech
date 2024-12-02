// routes/receta.routes.js
import { Router } from 'express';
import {
  getEnfermedades,
  getMedicamentos,
} from '../controllers/receta.controller.js';
import { verifyToken } from '../libs/auth.middleware.js';

const router = Router();

router.get('/enfermedades', verifyToken, getEnfermedades);
router.get('/medicamentos', verifyToken, getMedicamentos);

export default router;
