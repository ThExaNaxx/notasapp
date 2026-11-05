// Tarjeta que muestra un curso guardado con su promedio final
import { calcularPromedioFinal, formatearNota } from '../utils/calcularPromedio'

export function CursoCard({ curso, onEditar, onEliminar }) {
  const notasContinuas = curso.continuas.map((c) => c.nota)
  const { promedioContinuas, promedioFinal, aprobado } = calcularPromedioFinal({
    ...curso,
    continuas: notasContinuas,
  })

  return (
    <article className="card curso-card">
      <header className="curso-card-header">
        <h3>{curso.nombre}</h3>
        <span className={`badge ${aprobado ? 'badge-aprobado' : 'badge-desaprobado'}`}>
          {aprobado ? 'Aprobado' : 'Desaprobado'}
        </span>
      </header>

      <ul className="curso-notas">
        <li><span>Parcial 1</span><strong>{formatearNota(curso.parcial_1)}</strong></li>
        <li><span>Parcial 2</span><strong>{formatearNota(curso.parcial_2)}</strong></li>
        <li><span>Parcial 3</span><strong>{formatearNota(curso.parcial_3)}</strong></li>
        <li><span>Examen final</span><strong>{formatearNota(curso.examen_final)}</strong></li>
        <li>
          <span>Continuas ({notasContinuas.join(' · ') || '—'})</span>
          <strong>{formatearNota(promedioContinuas)}</strong>
        </li>
      </ul>

      <div className="curso-promedio">
        <span>Promedio final</span>
        <strong className={aprobado ? 'texto-aprobado' : 'texto-desaprobado'}>
          {formatearNota(promedioFinal)}
        </strong>
      </div>

      <div className="acciones">
        <button className="btn btn-secundario" onClick={() => onEditar(curso)}>Editar</button>
        <button className="btn btn-peligro" onClick={() => onEliminar(curso)}>Eliminar</button>
      </div>
    </article>
  )
}