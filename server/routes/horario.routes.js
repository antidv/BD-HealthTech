import express from 'express';
import { postHorario, getHorarios, getHorario, updateHorario, deleteHorario } from '../controllers/horario.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = express.Router();

router.post('/horarios', verifyToken, isAdmin, postHorario);
router.get('/horarios', verifyToken, isAdmin, getHorarios);
router.get('/horarios/:id', verifyToken, isAdmin, getHorario);
router.put('/horarios/:id', verifyToken, isAdmin, updateHorario);
router.delete('/horarios/:id', verifyToken, isAdmin, deleteHorario);

export default router;