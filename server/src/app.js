// src/app.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Importar rutas existentes
import antecedentesRoutes from '../routes/antecedentes.routes.js';
import authRoutes from '../routes/auth.routes.js';
import conMediPostaRoutes from '../routes/conMediPosta.routes.js';
import consultorioPostaRoutes from '../routes/consultorioPosta.routes.js';
import horarioRoutes from '../routes/horario.routes.js';
import medicoPostaRoutes from '../routes/medicoPosta.routes.js';
import medicosRoutes from '../routes/medicos.routes.js';
import pacientesRoutes from '../routes/pacientes.routes.js';
import postaRoutes from '../routes/posta.routes.js';
import citaRoutes from '../routes/cita.routes.js';
import diagnosticoRoutes from '../routes/diagnostico.routes.js';
import recetaRoutes from '../routes/receta.routes.js';

// Middlewares
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Usar rutas existentes
app.use('/api', antecedentesRoutes);
app.use('/api', authRoutes);
app.use('/api', conMediPostaRoutes);
app.use('/api', consultorioPostaRoutes);
app.use('/api', horarioRoutes);
app.use('/api', medicoPostaRoutes);
app.use('/api', medicosRoutes);
app.use('/api', pacientesRoutes);
app.use('/api', postaRoutes);
app.use('/api', citaRoutes);
app.use('/api', diagnosticoRoutes);
app.use('/api', recetaRoutes);

export default app;
