// index.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Importar rutas existentes
import antecedentesRoutes from './server/routes/antecedentes.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import consultorioPostaRoutes from './server/routes/consultorioPosta.routes.js';
import horarioRoutes from './server/routes/horario.routes.js';
import medicosRoutes from './server/routes/medicos.routes.js';
import pacientesRoutes from './server/routes/pacientes.routes.js';
import postaRoutes from './server/routes/posta.routes.js';

// Importar nuevas rutas
import citaRoutes from './server/routes/cita.routes.js';
import diagnosticoRoutes from './server/routes/diagnostico.routes.js';
import recetaRoutes from './server/routes/receta.routes.js';

// Crear instancia de Express
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173', // Ajusta esto si es necesario
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Registrar rutas existentes sin prefijo
app.use(antecedentesRoutes);
app.use(authRoutes);
app.use(consultorioPostaRoutes);
app.use(horarioRoutes);
app.use(medicosRoutes);
app.use(pacientesRoutes);
app.use(postaRoutes);

// Registrar nuevas rutas sin prefijo
app.use(citaRoutes);
app.use(diagnosticoRoutes);
app.use(recetaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto', PORT);
});
