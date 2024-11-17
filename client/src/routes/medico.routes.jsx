import { Route } from "react-router-dom";

export default function RutasMedico() {
  return (
    <>
      <Route path='/medico' element={<h1>Hola Medico</h1>} />
      <Route path='/prueba' element={<h1>Hola Prueba Medico</h1>} />
    </>
  )
}
