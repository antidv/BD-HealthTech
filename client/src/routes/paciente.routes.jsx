import { Navigate, Route } from "react-router-dom";
import Paciente from "../pages/paciente/Paciente";
import CitasDisponibles from "../pages/paciente/CitasDisponibles";
import SolicitarCita from "../pages/paciente/SolicitarCita";
import Antecedentes from "../pages/paciente/Antecedentes";
import DetallesCita from "../pages/paciente/DetallesCita";

export default function RutasPaciente() {
  return (
    <>
      <Route path="/paciente/">
        {/* Redirigir a citas */}
        <Route index element={<Navigate to="citas" replace />} />

        {/* Citas */}
        <Route path="citas" element={<Paciente />} />
        <Route path="citas/:idcita" element={<DetallesCita />} />
        <Route path="citas-disponibles" element={<CitasDisponibles />} />
        <Route
          path="solicitar-cita/:idprogramacion_cita"
          element={<SolicitarCita />}
        />

        {/* Antecedentes */}
        <Route path="antecedentes" element={<Antecedentes />} />
      </Route>
    </>
  );
}
