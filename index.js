import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import medicosRoutes from './server/routes/medicos.routes.js';
import pacienteRoutes from './server/routes/pacientes.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import antecendetesRoutes from './server/routes/antecedentes.routes.js';
import postaRoutes from './server/routes/posta.routes.js';
import horarioRoutes from './server/routes/horario.routes.js';
import consultorioPosta from './server/routes/consultorioPosta.routes.js';
import medicoConsultorioPosta from './server/routes/medicoConsultorioPosta.routes.js'
import programacionCita from './server/routes/programacionCita.routes.js'

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(authRoutes);
app.use(medicosRoutes);
app.use(pacienteRoutes);
app.use(antecendetesRoutes);
app.use(postaRoutes);
app.use(horarioRoutes);
app.use(consultorioPosta);
app.use(medicoConsultorioPosta);
app.use(programacionCita)

app.listen(3000)
console.log('Server on port', 3000);