// routes/cita.routes.js
import { Router } from 'express';
import {
  getCitasPaciente,
  getCitasMedico,
  getCita,
  postCita,
  updateCita,
} from '../controllers/cita.controller.js';
import { verifyToken, isMedico, isPaciente } from '../libs/auth.middleware.js';

const router = Router();

router.get('/citas_paciente', verifyToken, isPaciente, getCitasPaciente);
router.get('/citas_medico', verifyToken, isMedico, getCitasMedico);
router.get('/citas/:id', verifyToken, isMedico, getCita);
router.post('/citas', verifyToken, isPaciente, postCita);
router.put('/citas/:id', verifyToken, isMedico, updateCita);

export default router;
