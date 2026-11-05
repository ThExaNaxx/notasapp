// Funciones que leen y guardan cursos y continuas en Supabase
import { supabase } from '../../../lib/supabaseClient'

// Convierte ['15', '17'] → [{ curso_id, numero: 1, nota: 15 }, { ... numero: 2 ... }]
function armarContinuas(cursoId, notas) {
  return notas.map((nota, indice) => ({
    curso_id: cursoId,
    numero: indice + 1,
    nota: Number(nota),
  }))
}

export async function listarCursos() {
  const { data, error } = await supabase
    .from('cursos')
    .select('*, continuas(numero, nota)')
    .order('created_at', { ascending: true })
    .order('numero', { referencedTable: 'continuas', ascending: true })
  if (error) throw error
  return data
}

export async function crearCurso(curso, notasContinuas) {
  // 1) Guardamos el curso y pedimos que nos devuelva el registro creado (con su id)
  const { data: nuevoCurso, error } = await supabase
    .from('cursos')
    .insert(curso)
    .select()
    .single()
  if (error) throw error

  // 2) Guardamos sus continuas usando el id del curso
  const { error: errorContinuas } = await supabase
    .from('continuas')
    .insert(armarContinuas(nuevoCurso.id, notasContinuas))

  if (errorContinuas) {
    // Si fallan las continuas, borramos el curso para no dejarlo incompleto
    await supabase.from('cursos').delete().eq('id', nuevoCurso.id)
    throw errorContinuas
  }

  return nuevoCurso
}

export async function actualizarCurso(id, curso, notasContinuas) {
  // 1) Actualizamos las notas del curso
  const { error } = await supabase.from('cursos').update(curso).eq('id', id)
  if (error) throw error

  // 2) Borramos las continuas anteriores...
  const { error: errorBorrar } = await supabase.from('continuas').delete().eq('curso_id', id)
  if (errorBorrar) throw errorBorrar

  // 3) ...y guardamos las nuevas (pudo cambiar la cantidad)
  const { error: errorInsertar } = await supabase
    .from('continuas')
    .insert(armarContinuas(id, notasContinuas))
  if (errorInsertar) throw errorInsertar
}

export async function eliminarCurso(id) {
  // Las continuas se borran solas gracias a "on delete cascade"
  const { error } = await supabase.from('cursos').delete().eq('id', id)
  if (error) throw error
}