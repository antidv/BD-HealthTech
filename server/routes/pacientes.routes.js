import { Router } from 'express';
import {verificarPaciente, registrarPaciente} from '../controllers/pacientes.controller.js';

const router = Router();

router.post('/verificar_paciente', verificarPaciente);
router.post('/registrar_paciente', registrarPaciente);

export default router;