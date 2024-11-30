import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import antecedentesRoutes from '../routes/antecedentes.routes.js';
import authRoutes from '../routes/auth.routes.js';
import consultorioPostaRoutes from '../routes/consultorioPosta.routes.js';
import horarioRoutes from '../routes/horario.routes.js';
import medicoConsultorioPostaRoutes from '../routes/medicoConsultorioPosta.routes.js'
import programacionCitaRoutes from '../routes/programacionCita.routes.js'
import medicosRoutes from '../routes/medicos.routes.js';
import pacientesRoutes from '../routes/pacientes.routes.js';
import postaRoutes from '../routes/posta.routes.js';
import citaRoutes from '../routes/cita.routes.js';
import diagnosticoRoutes from '../routes/diagnostico.routes.js';
import recetaRoutes from '../routes/receta.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(antecedentesRoutes);
app.use(authRoutes);
app.use(consultorioPostaRoutes);
app.use(pacientesRoutes);
app.use(postaRoutes);
app.use(horarioRoutes);
app.use(medicosRoutes);
app.use(medicoConsultorioPostaRoutes);
app.use(programacionCitaRoutes)
app.use(citaRoutes);
app.use(diagnosticoRoutes);
app.use(recetaRoutes);

export default app;
