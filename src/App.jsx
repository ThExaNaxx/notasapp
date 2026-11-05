// Define las rutas (páginas) de la aplicación
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { PublicRoute } from './features/auth/components/PublicRoute'
import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'
import { CursosPage } from './features/cursos/pages/CursosPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas: solo si NO has iniciado sesión */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>

        {/* Rutas privadas: solo si YA iniciaste sesión */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<CursosPage />} />
        </Route>

        {/* Cualquier otra URL → inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App