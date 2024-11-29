import { Route, Navigate } from "react-router-dom";
import Postas from "../pages/admin/Postas";
import Medicos from "../pages/admin/Medicos";

export default function RutasAdmin() {
  return (
    <Route path="/admin/">
      {/* Redirigir automáticamente a /admin/postas */}
      <Route index element={<Navigate to="postas" replace />} />

      {/* Rutas relacionadas al manejo de postas */}
      <Route path="postas" element={<Postas />} />
      <Route path="postas/:idposta" element={<h1>Posta elegida</h1>} />
      <Route path="registrar/posta" element={<h1>Registrar Posta</h1>} />
      <Route path="editar/posta/:id" element={<h1>Editar Posta elegida</h1>} />

      {/* Rutas relacionadas al manejo de medicos */}
      <Route path="medicos" element={<Medicos />} />
      <Route path="medicos/:idmedico" element={<h1>Medico elegido</h1>} />
      <Route path="registrar/medico" element={<h1>Registrar Medico</h1>} />
      <Route
        path="editar/medico/:id"
        element={<h1>Editar MEdico elegida</h1>}
      />
    </Route>
  );
}
