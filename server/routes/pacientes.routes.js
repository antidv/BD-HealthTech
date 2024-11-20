import { Router } from 'express';
import { verificarPaciente, registrarPaciente, verPacientes, verPaciente, perfilPaciente, updatePaciente } from '../controllers/pacientes.controller.js';
import { verifyToken, isAdmin, isPaciente } from '../libs/auth.middleware.js';

const router = Router();

router.post('/verificar_paciente', verificarPaciente);
router.post('/registrar_paciente', registrarPaciente);
router.get('/ver_pacientes', verifyToken, isAdmin, verPacientes);
router.get('/ver_paciente/:id', verifyToken, isAdmin, verPaciente);
router.get('/perfil_paciente', verifyToken, isPaciente, perfilPaciente);
router.put('/update_paciente', verifyToken, isPaciente, updatePaciente);

export default router;