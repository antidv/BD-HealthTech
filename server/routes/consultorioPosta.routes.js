import express from "express";
import { postConsultorioPosta, getConsultorioPostas, getConsultorioPosta, updateConsultorioPosta } from "../controllers/consultorioPosta.controller.js";
import { verifyToken, isAdmin } from "../libs/auth.middleware.js";

const router = express.Router();

router.post("/consultorio-posta", verifyToken, isAdmin, postConsultorioPosta);
router.get("/consultorio-posta", verifyToken, getConsultorioPostas);
router.get("/consultorio-posta/:id", verifyToken, getConsultorioPosta);
router.put("/consultorio-posta/:id", verifyToken, isAdmin, updateConsultorioPosta);

export default router;