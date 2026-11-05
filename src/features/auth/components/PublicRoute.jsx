// Para login y registro: si YA hay sesión, mandamos al inicio (/)
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function PublicRoute() {
  const { user, cargando } = useAuth()

  if (cargando) return <p className="cargando">Cargando...</p>
  if (user) return <Navigate to="/" replace />

  return <Outlet />
}