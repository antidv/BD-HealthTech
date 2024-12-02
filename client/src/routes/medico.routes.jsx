import { Navigate, Route } from "react-router-dom";
import MedicoPrincipal from "../pages/medico/MedicoPrincipal";
import GenerarDiagnostico from "../pages/medico/GenerarDiagnostico";
import Postas from "../pages/medico/Postas";
import Consultorios from "../pages/medico/Consultorios";
import Programacion from "../pages/medico/Programacion"

export default function RutasMedico() {
  return (
    <>
      <Route path="/medico/">
        <Route index element={<Navigate to={"citas"} replace />} />
        {/* Redirigir a citas */}
        <Route path="citas" element={<MedicoPrincipal />} />
        <Route path="postas" element={<Postas />} />
        <Route path="consultorios" element={<Consultorios />} />
        <Route path="programacion" element={<Programacion />} />
        {/* Diagnostico */}
        <Route path="diagnostico/:idcita" element={<GenerarDiagnostico />} />
      </Route>
    </>
  );
}
