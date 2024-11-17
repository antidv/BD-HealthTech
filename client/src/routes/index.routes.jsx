import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import { PrivateRoute } from './private.routes'
import RutasPaciente from './paciente.routes'
import RutasMedico from './medico.routes'
import RutasAdmin from './admin.routes'
import ErrorPage from '../pages/ErrorPage'
import NavBar from '../components/NavBar'

export default function Rutas() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Ruta pública */}
        <Route path='/' element={<Login />} />

        {/* Rutas protegidas por rol */}
        <Route element={<PrivateRoute requiredRole="Paciente"/>} >
          {RutasPaciente()}
        </Route>
        <Route element={<PrivateRoute requiredRole="Medico"/>} >
          {RutasMedico()}
        </Route>
        <Route element={<PrivateRoute requiredRole="Administrador"/>} >
          {RutasAdmin()}
        </Route>

        {/* Manejo de errores */}
        <Route path='/403' element={ <ErrorPage code={403} message={"No autorizado"} /> } />
        <Route path='*' element={ <ErrorPage code={404} message={"No encontrado"} /> } />
      </Routes>
    </BrowserRouter>
  )
}
