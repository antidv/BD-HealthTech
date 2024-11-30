// routes/cita.routes.js
import { Router } from 'express';
import {
  getCitas,
  getCita,
  postCita,
  updateCita,
  deleteCita,
} from '../controllers/cita.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/citas', verifyToken, isAdmin, getCitas);
router.get('/citas/:id', verifyToken, isAdmin, getCita);
router.post('/citas', verifyToken, isAdmin, postCita);
router.put('/citas/:id', verifyToken, isAdmin, updateCita);
router.delete('/citas/:id', verifyToken, isAdmin, deleteCita);

export default router;
