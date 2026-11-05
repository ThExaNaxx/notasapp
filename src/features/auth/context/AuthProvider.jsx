// Escucha a Supabase Auth y comparte la sesión con toda la app
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { obtenerPerfil } from '../services/authService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)

  // 1) Al abrir la app: ¿ya hay una sesión guardada?
  // 2) Luego: escuchar cada vez que el usuario inicia o cierra sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCargando(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSession(nuevaSesion)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  // Cuando cambia el usuario, traemos su perfil (nombres, apellidos...)
  const userId = session?.user?.id
  useEffect(() => {
    if (!userId) return
    obtenerPerfil(userId)
      .then(setPerfil)
      .catch(() => setPerfil(null))
  }, [userId])

  const valor = {
    session,
    user: session?.user ?? null,
    perfil: userId ? perfil : null,
    cargando,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}