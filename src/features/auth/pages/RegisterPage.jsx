import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { registrarEstudiante } from '../services/authService'

const FORM_INICIAL = { nombres: '', apellidos: '', codigo: '', email: '', password: '' }

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_INICIAL)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setEnviando(true)
    try {
      const { session } = await registrarEstudiante(form)
      if (session) {
        // "Confirm email" desactivado: entra directo
        navigate('/')
      } else {
        // "Confirm email" activado: debe revisar su correo
        setMensaje('¡Cuenta creada! Revisa tu correo y confirma tu cuenta para poder ingresar.')
        setForm(FORM_INICIAL)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <p className="subtitulo">Regístrate como estudiante</p>

        <div className="fila-2">
          <label>
            Nombres
            <input name="nombres" value={form.nombres} onChange={handleChange} required />
          </label>
          <label>
            Apellidos
            <input name="apellidos" value={form.apellidos} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Código de estudiante
          <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ej. U20261234" />
        </label>

        <label>
          Correo electrónico
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Contraseña (mínimo 6 caracteres)
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className="alerta error">{error}</p>}
        {mensaje && <p className="alerta exito">{mensaje}</p>}

        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}