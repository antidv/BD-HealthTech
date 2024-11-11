import { Router } from "express";
import { postConsultorioMediposta, getConsultoriosMedipostas, getConsultorioMediposta, updateConsultorioMediposta, deleteConsultorioMediposta } from "../controllers/conMediPosta.controller.js";
import { verifyToken, isAdmin } from '../controllers/auth.middleware.js';

const router = Router();

router.post("/consultoriosMP", verifyToken, isAdmin, postConsultorioMediposta);
router.get("/consultoriosMP", verifyToken, isAdmin, getConsultoriosMedipostas);
router.get("/consultoriosMP/:id", verifyToken, isAdmin, getConsultorioMediposta);
router.put("/consultoriosMP/:id", verifyToken, isAdmin, updateConsultorioMediposta);
router.delete("/consultoriosMP/:id", verifyToken, isAdmin, deleteConsultorioMediposta);

export default router;