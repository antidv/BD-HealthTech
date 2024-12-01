import express from 'express';
import { getHorarios, getHorario } from '../controllers/horario.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = express.Router();

router.get('/horarios', verifyToken, getHorarios);
router.get('/horarios/:id', verifyToken, getHorario);

export default router;