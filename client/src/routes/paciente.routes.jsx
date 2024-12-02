import { Navigate, Route } from "react-router-dom";
import Paciente from "../pages/paciente/Paciente";
// import CitasDisponibles from "../pages/paciente/CitasDisponibles";

export default function RutasPaciente() {
  return (
    <>
      <Route path="/paciente/">
        {/* Redirigir a citas */}
        <Route index element={<Navigate to="citas" replace />} />

        {/* Citas */}
        <Route path="citas" element={<Paciente />} />
        {/* <Route path="citas-disponibles" element={<CitasDisponibles />} /> */}
      </Route>
    </>
  );
}
