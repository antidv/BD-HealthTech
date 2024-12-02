import { Router } from 'express';
import {
  getProgramacionesCita,
  getProgramacionCita,
  postProgramacionCita,
  deleteProgramacionCita,
  getCitasProgramadas
} from '../controllers/programacionCita.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/programacion-cita', verifyToken, getProgramacionesCita);
router.get('/programacioncita-ciudad', verifyToken, getCitasProgramadas);
router.get('/programacion-cita/:id', verifyToken, getProgramacionCita);
router.post('/programacion-cita', verifyToken, isAdmin, postProgramacionCita);
router.delete('/programacion-cita/:id', verifyToken, isAdmin, deleteProgramacionCita);

export default router;
