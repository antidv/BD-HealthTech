import { Route } from "react-router-dom";

export default function RutasAdmin() {
  return (
    <>
      <Route path='/admin' element={<h1>Hola Admin</h1>} />
      <Route path='/prueba' element={<h1>Hola Prueba Admin</h1>} />
    </>
  )
}
