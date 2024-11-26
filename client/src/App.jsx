import { IniciarSesion } from './components/general/iniciar_sesion'
import { AuthProvider } from './context/AuthContext'
import Rutas from './routes/index.routes'

function App() {

  return (
    <AuthProvider>
      {/* <Rutas /> */}
      <IniciarSesion />
    </AuthProvider>
  )
}

export default App
