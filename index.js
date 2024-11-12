import express from 'express';
import cookieParser from 'cookie-parser';
import medicosRoutes from './server/routes/medicos.routes.js';
import pacienteRoutes from './server/routes/pacientes.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import antecendetesRoutes from './server/routes/antecedentes.routes.js';
import postaRoutes from './server/routes/posta.routes.js'
import horarioRoutes from './server/routes/horario.routes.js'
import conMediPosta from './server/routes/conMediPosta.routes.js'
import medicoPosta from './server/routes/medicoPosta.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(medicosRoutes);
app.use(pacienteRoutes);
app.use(antecendetesRoutes);
app.use(postaRoutes)
app.use(horarioRoutes)
app.use(conMediPosta)
app.use(medicoPosta)

app.listen(3000)
console.log('Server on port', 3000);