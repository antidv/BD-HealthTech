import { Router } from 'express';
import { getConsultoriosFaltantes } from '../controllers/especialidadConsultorio.controller.js'
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/especialidad-consultorio/:idmedico', verifyToken, isAdmin, getConsultoriosFaltantes);

export default router;
