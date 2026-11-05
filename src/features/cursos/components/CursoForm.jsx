// Formulario para crear o editar un curso con sus notas
import { useState } from 'react'
import { ContinuasInputs } from './ContinuasInputs'
import { calcularPromedioFinal, formatearNota } from '../utils/calcularPromedio'

const PARCIALES = [
  { campo: 'parcial_1', etiqueta: 'Parcial 1 (10%)' },
  { campo: 'parcial_2', etiqueta: 'Parcial 2 (20%)' },
  { campo: 'parcial_3', etiqueta: 'Parcial 3 (20%)' },
  { campo: 'examen_final', etiqueta: 'Examen final (30%)' },
]

// Si recibimos un curso (modo editar) llenamos el formulario con sus datos
function valoresIniciales(curso) {
  if (!curso) {
    return {
      nombre: '',
      parcial_1: '',
      parcial_2: '',
      parcial_3: '',
      examen_final: '',
      continuas: ['', '', ''],
    }
  }
  return {
    nombre: curso.nombre,
    parcial_1: String(curso.parcial_1),
    parcial_2: String(curso.parcial_2),
    parcial_3: String(curso.parcial_3),
    examen_final: String(curso.examen_final),
    continuas: curso.continuas.length > 0 ? curso.continuas.map((c) => String(c.nota)) : [''],
  }
}

export function CursoForm({ cursoInicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() => valoresIniciales(cursoInicial))
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const resultado = calcularPromedioFinal(form)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const curso = {
        nombre: form.nombre.trim(),
        parcial_1: Number(form.parcial_1),
        parcial_2: Number(form.parcial_2),
        parcial_3: Number(form.parcial_3),
        examen_final: Number(form.examen_final),
      }
      await onGuardar(curso, form.continuas)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <form className="card curso-form" onSubmit={handleSubmit}>
      <h2>{cursoInicial ? 'Editar curso' : 'Nuevo curso'}</h2>

      <label>
        Nombre del curso
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. Matemática Básica"
          required
          minLength={2}
          maxLength={100}
        />
      </label>

      <div className="parciales-grid">
        {PARCIALES.map(({ campo, etiqueta }) => (
          <label key={campo}>
            {etiqueta}
            <input
              type="number"
              name={campo}
              min="0"
              max="20"
              step="0.01"
              value={form[campo]}
              onChange={handleChange}
              required
            />
          </label>
        ))}
      </div>

      <ContinuasInputs
        notas={form.continuas}
        onChange={(continuas) => setForm({ ...form, continuas })}
      />

      {/* Resumen en vivo: cuánto aporta cada nota al promedio final */}
      <table className="tabla-resumen">
        <thead>
          <tr>
            <th>Evaluación</th>
            <th>Nota</th>
            <th>Peso</th>
            <th>Aporte</th>
          </tr>
        </thead>
        <tbody>
          {resultado.detalle.map((item) => (
            <tr key={item.nombre}>
              <td>{item.nombre}</td>
              <td>{formatearNota(item.nota)}</td>
              <td>{item.peso * 100}%</td>
              <td>{formatearNota(item.aporte)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Promedio final</td>
            <td className={resultado.aprobado ? 'texto-aprobado' : 'texto-desaprobado'}>
              {formatearNota(resultado.promedioFinal)}
            </td>
          </tr>
        </tfoot>
      </table>

      {error && <p className="alerta error">{error}</p>}

      <div className="acciones">
        <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar curso'}
        </button>
      </div>
    </form>
  )
}