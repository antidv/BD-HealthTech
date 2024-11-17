import { Route } from "react-router-dom";

export default function RutasPaciente() {
  return (
    <>
      <Route path='/paciente' element={<h1>Hola Paciente</h1>} />
      <Route path='/prueba' element={<h1>Hola Prueba Paciente</h1>} />
    </>
  )
}
