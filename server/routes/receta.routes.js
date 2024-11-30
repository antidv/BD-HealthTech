// routes/receta.routes.js
import { Router } from 'express';
import {
  getRecetas,
  getReceta,
  postReceta,
  updateReceta,
  deleteReceta,
} from '../controllers/receta.controller.js';
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.get('/recetas', verifyToken, isAdmin, getRecetas);
router.get('/recetas/:id', verifyToken, isAdmin, getReceta);
router.post('/recetas', verifyToken, isAdmin, postReceta);
router.put('/recetas/:id', verifyToken, isAdmin, updateReceta);
router.delete('/recetas/:id', verifyToken, isAdmin, deleteReceta);

export default router;
