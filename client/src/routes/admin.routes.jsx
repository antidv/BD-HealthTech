import { Route, Navigate } from "react-router-dom";
import Postas from "../pages/admin/Postas";
import Medicos from "../pages/admin/Medicos";
import RegistrarPosta from "../pages/admin/RegistrarPosta";
import RegistrarMedico from "../pages/admin/RegistrarMedico";
import ConsultoriosPosta from "../pages/admin/ConsultoriosPosta";

export default function RutasAdmin() {
  return (
    <Route path="/admin/">
      {/* Redirigir automáticamente a /admin/postas */}
      <Route index element={<Navigate to="postas" replace />} />

      {/* Rutas relacionadas al manejo de postas */}
      <Route path="postas" element={<Postas />} />
      <Route path="postas/:idposta" element={<ConsultoriosPosta />} />
      <Route path="registrar/posta" element={<RegistrarPosta />} />
      <Route path="editar/posta/:id" element={<h1>Editar Posta elegida</h1>} />

      {/* Rutas relacionadas al manejo de medicos */}
      <Route path="medicos" element={<Medicos />} />
      <Route path="medicos/:idmedico" element={<h1>Medico elegido</h1>} />
      <Route path="registrar/medico" element={<RegistrarMedico />} />
      <Route
        path="editar/medico/:id"
        element={<h1>Editar MEdico elegida</h1>}
      />
    </Route>
  );
}
