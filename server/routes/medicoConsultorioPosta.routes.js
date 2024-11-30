import { Router } from 'express';
import {
  getMedicoConsultorioPostas,
  getMedicoConsultorioPosta,
  postMedicoConsultorioPosta,
  updateMedicoConsultorioPosta
} from '../controllers/medicoConsultorioPosta.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/medico-consultorio-posta', verifyToken, getMedicoConsultorioPostas);
router.get('/medico-consultorio-posta/:id', verifyToken, getMedicoConsultorioPosta);
router.post('/medico-consultorio-posta', verifyToken, isAdmin, postMedicoConsultorioPosta);
router.put('/medico-consultorio-posta/:id', verifyToken, isAdmin, updateMedicoConsultorioPosta);

export default router;
