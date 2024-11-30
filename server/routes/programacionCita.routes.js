import { Router } from 'express';
import {
  getProgramacionesCita,
  getProgramacionCita,
  postProgramacionCita,
  updateProgramacionCita
} from '../controllers/programacionCita.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/programacion-cita', verifyToken, getProgramacionesCita);
router.get('/programacion-cita/:id', verifyToken, getProgramacionCita);
router.post('/programacion-cita', verifyToken, isAdmin, postProgramacionCita);
router.put('/programacion-cita/:id', verifyToken, isAdmin, updateProgramacionCita);

export default router;
