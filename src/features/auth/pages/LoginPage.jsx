import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { iniciarSesion } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await iniciarSesion(form)
      navigate('/')
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos'
          : err.message
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <p className="subtitulo">Registra y calcula las notas de tus cursos</p>

        <label>
          Correo electrónico
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className="alerta error">{error}</p>}

        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  )
}