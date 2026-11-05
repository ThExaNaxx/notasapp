// Permite elegir cuántas continuas hay y muestra un input por cada una
import { calcularPromedioContinuas, formatearNota } from '../utils/calcularPromedio'

const MINIMO = 1
const MAXIMO = 10

export function ContinuasInputs({ notas, onChange }) {
  function cambiarCantidad(cantidad) {
    const nueva = Math.min(MAXIMO, Math.max(MINIMO, Number(cantidad) || MINIMO))
    if (nueva > notas.length) {
      // Agregamos inputs vacíos al final
      onChange([...notas, ...Array(nueva - notas.length).fill('')])
    } else {
      // Quitamos los últimos inputs
      onChange(notas.slice(0, nueva))
    }
  }

  function cambiarNota(indice, valor) {
    const copia = [...notas]
    copia[indice] = valor
    onChange(copia)
  }

  return (
    <fieldset className="continuas">
      <legend>Evaluaciones continuas (20%)</legend>

      <div className="continuas-cantidad">
        <span>Número de continuas:</span>
        <button
          type="button"
          className="btn btn-icono"
          onClick={() => cambiarCantidad(notas.length - 1)}
          disabled={notas.length <= MINIMO}
          aria-label="Quitar continua"
        >
          −
        </button>
        <input
          type="number"
          min={MINIMO}
          max={MAXIMO}
          value={notas.length}
          onChange={(e) => cambiarCantidad(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-icono"
          onClick={() => cambiarCantidad(notas.length + 1)}
          disabled={notas.length >= MAXIMO}
          aria-label="Agregar continua"
        >
          +
        </button>
      </div>

      <div className="continuas-grid">
        {notas.map((nota, indice) => (
          <label key={indice}>
            C{indice + 1}
            <input
              type="number"
              min="0"
              max="20"
              step="0.01"
              value={nota}
              onChange={(e) => cambiarNota(indice, e.target.value)}
              required
            />
          </label>
        ))}
      </div>

      <p className="continuas-promedio">
        Promedio de continuas: <strong>{formatearNota(calcularPromedioContinuas(notas))}</strong>
        <small> (suma ÷ {notas.length})</small>
      </p>
    </fieldset>
  )
}