// Solo deja pasar a usuarios CON sesión. Si no hay sesión → /login
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user, cargando } = useAuth()

  if (cargando) return <p className="cargando">Cargando...</p>
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}