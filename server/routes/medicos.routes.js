import { Router } from "express";
import * as medicosCtrl from "../controllers/medicos.controller.js";

const router = Router();

router.get('/medicos', medicosCtrl.getMedicos);
router.get('/medicos/:id', medicosCtrl.getMedico);
router.post('/medicos', medicosCtrl.postMedico);
router.put('/medicos/:id', medicosCtrl.updateMedicos);
router.delete('/medicos/:id', medicosCtrl.deleteMedicos);

export default router;