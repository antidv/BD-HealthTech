import { Route, Navigate } from "react-router-dom";
import Postas from "../pages/admin/Postas";
import Medicos from "../pages/admin/Medicos";
import RegistrarPosta from "../pages/admin/RegistrarPosta";
import RegistrarMedico from "../pages/admin/RegistrarMedico";
import ConsultoriosPosta from "../pages/admin/ConsultoriosPosta";
import EditarPosta from "../pages/admin/EditarPosta";
import ConsultoriosMedico from "../pages/admin/ConsultoriosMedico";
import EditarMedico from "../pages/admin/EditarMedico";

export default function RutasAdmin() {
  return (
    <Route path="/admin/">
      {/* Redirigir automáticamente a /admin/postas */}
      <Route index element={<Navigate to="postas" replace />} />

      {/* Rutas relacionadas al manejo de postas */}
      <Route path="postas" element={<Postas />} />
      <Route path="postas/:idposta" element={<ConsultoriosPosta />} />
      <Route path="registrar/posta" element={<RegistrarPosta />} />
      <Route path="editar/posta/:idposta" element={<EditarPosta />} />

      {/* Rutas relacionadas al manejo de medicos */}
      <Route path="medicos" element={<Medicos />} />
      <Route path="medicos/:idmedico" element={<ConsultoriosMedico />} />
      <Route path="registrar/medico" element={<RegistrarMedico />} />
      <Route
        path="editar/medico/:idmedico"
        element={<EditarMedico />}
      />
    </Route>
  );
}
