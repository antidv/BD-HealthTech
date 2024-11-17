import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import { PrivateRoutePaciente } from './private.routes'

export default function Rutas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<PrivateRoutePaciente />} >
          <Route path='/paciente' element={<h1>Hola Paciente</h1>} />
        </Route>
        <Route path='/medico' element={<h1>Hola Medico</h1>} />
      </Routes>
    </BrowserRouter>
  )
}