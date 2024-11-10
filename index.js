import express from 'express';
import cookieParser from 'cookie-parser';
import medicosRoutes from './server/routes/medicos.routes.js';
import pacienteRoutes from './server/routes/pacientes.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import antecendetesRoutes from './server/routes/antecedentes.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(medicosRoutes);
app.use(pacienteRoutes);
app.use(antecendetesRoutes);

app.listen(3000)
console.log('Server on port', 3000);