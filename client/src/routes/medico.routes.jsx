import { Route } from "react-router-dom";
import MedicoPrincipal from "../pages/medico/MedicoPrincipal";

export default function RutasMedico() {
  return (
    <>
      <Route path='/medico' element={<MedicoPrincipal />} />
      <Route path='/prueba' element={<h1>Hola Prueba Medico</h1>} />
    </>
  )
}
