import express from "express";
import { 
    postConsultorioPosta,
    getConsultorios,
    getConsultoriosFaltantes,
    getConsultorioPostaDetails,
    getConsultorioPosta,
    updateConsultorioPosta 
} from "../controllers/consultorioPosta.controller.js";
import { verifyToken, isAdmin } from "../libs/auth.middleware.js";

const router = express.Router();

router.post("/consultorio-posta", verifyToken, isAdmin, postConsultorioPosta);
router.get("/consultorio-medicos/:idconsultorio_posta", verifyToken, getConsultorioPostaDetails);
router.get("/consultorios", verifyToken, getConsultorios);
router.get("/consultorios-faltantes/:idposta", verifyToken, isAdmin, getConsultoriosFaltantes);
router.get("/consultorio-posta/:id", verifyToken, getConsultorioPosta);
router.put("/consultorio-posta/:id", verifyToken, isAdmin, updateConsultorioPosta);

export default router;