// Funciones que hablan con Supabase Auth (registro, login, logout, perfil)
import { supabase } from '../../../lib/supabaseClient'

export async function registrarEstudiante({ email, password, nombres, apellidos, codigo }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Estos datos llegan a la tabla "perfiles" gracias al trigger SQL
      data: { nombres, apellidos, codigo },
      emailRedirectTo: window.location.origin,
    },
  })
  if (error) throw error
  return data
}

export async function iniciarSesion({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function obtenerPerfil(userId) {
  const { data, error } = await supabase
    .from('perfiles')
    .select('nombres, apellidos, codigo')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}