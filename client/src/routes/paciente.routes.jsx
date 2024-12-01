import { Route } from "react-router-dom";
import Paciente from "../pages/paciente/Paciente";

export default function RutasPaciente() {
  return (
    <>
      <Route path='/paciente' element={<Paciente />} />
      <Route path='/prueba' element={<h1>Hola Prueba Paciente</h1>} />
    </>
  )
}
