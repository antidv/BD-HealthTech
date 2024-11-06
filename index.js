import express from 'express';
import medicosRoutes from './server/routes/medicos.routes.js';

const app = express();
app.use(express.json());

app.use(medicosRoutes);

app.listen(3000)
console.log('Server on port', 3000);