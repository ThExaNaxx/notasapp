// Barra superior: nombre del estudiante y botón para cerrar sesión
import { useAuth } from '../../features/auth/hooks/useAuth'
import { cerrarSesion } from '../../features/auth/services/authService'

export function Navbar() {
  const { user, perfil } = useAuth()
  const nombre = perfil?.nombres || user?.email

  return (
    <nav className="navbar">
      <span className="navbar-logo">📘 Mis Notas</span>
      <div className="navbar-usuario">
        <span>Hola, {nombre}</span>
        <button className="btn btn-secundario" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}