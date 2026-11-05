// Página principal: lista los cursos del estudiante y permite crear / editar / eliminar
import { useEffect, useState } from 'react'
import { Navbar } from '../../../shared/components/Navbar'
import { CursoCard } from '../components/CursoCard'
import { CursoForm } from '../components/CursoForm'
import {
  actualizarCurso,
  crearCurso,
  eliminarCurso,
  listarCursos,
} from '../services/cursosService'

export function CursosPage() {
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // null = formulario cerrado | 'nuevo' = creando | objeto curso = editando
  const [cursoEnFormulario, setCursoEnFormulario] = useState(null)

  // Vuelve a pedir la lista (después de guardar o eliminar)
  async function cargarCursos() {
    try {
      const data = await listarCursos()
      setCursos(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // Al abrir la página traemos los cursos desde Supabase
  useEffect(() => {
    listarCursos()
      .then(setCursos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  async function handleGuardar(curso, notasContinuas) {
    if (cursoEnFormulario === 'nuevo') {
      await crearCurso(curso, notasContinuas)
    } else {
      await actualizarCurso(cursoEnFormulario.id, curso, notasContinuas)
    }
    setCursoEnFormulario(null)
    await cargarCursos()
  }

  async function handleEliminar(curso) {
    if (!window.confirm(`¿Eliminar el curso "${curso.nombre}"?`)) return
    try {
      await eliminarCurso(curso.id)
      await cargarCursos()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Navbar />
      <main className="contenedor">
        <div className="pagina-header">
          <div>
            <h1>Mis cursos</h1>
            <p className="subtitulo">
              P1 10% · P2 20% · P3 20% · Examen final 30% · Continuas 20%
            </p>
          </div>
          {cursoEnFormulario === null && (
            <button className="btn btn-primario" onClick={() => setCursoEnFormulario('nuevo')}>
              + Agregar curso
            </button>
          )}
        </div>

        {error && <p className="alerta error">{error}</p>}

        {cursoEnFormulario !== null && (
          <CursoForm
            key={cursoEnFormulario === 'nuevo' ? 'nuevo' : cursoEnFormulario.id}
            cursoInicial={cursoEnFormulario === 'nuevo' ? null : cursoEnFormulario}
            onGuardar={handleGuardar}
            onCancelar={() => setCursoEnFormulario(null)}
          />
        )}

        {cargando ? (
          <p className="cargando">Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <p className="vacio">Aún no registras cursos. ¡Agrega el primero!</p>
        ) : (
          <section className="cursos-grid">
            {cursos.map((curso) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                onEditar={setCursoEnFormulario}
                onEliminar={handleEliminar}
              />
            ))}
          </section>
        )}
      </main>
    </>
  )
}