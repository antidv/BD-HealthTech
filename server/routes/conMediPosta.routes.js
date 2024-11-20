import { Router } from "express";
import { postConsultorioMediposta, getConsultoriosMedipostas, getConsultorioMediposta, updateConsultorioMediposta, deleteConsultorioMediposta } from "../controllers/conMediPosta.controller.js";
import { verifyToken, isAdmin } from '../libs/auth.middleware.js';

const router = Router();

router.post("/consultoriosMP", verifyToken, isAdmin, postConsultorioMediposta);
router.get("/consultoriosMP", verifyToken, getConsultoriosMedipostas);
router.get("/consultoriosMP/:id", verifyToken, getConsultorioMediposta);
router.put("/consultoriosMP/:id", verifyToken, isAdmin, updateConsultorioMediposta);
router.delete("/consultoriosMP/:id", verifyToken, isAdmin, deleteConsultorioMediposta);

export default router;