import { useEffect } from 'react'

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth() // REMOVE checkAuth daqui
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      localStorage.setItem('redirectAfterLogin', location.pathname)
    }
  }, [loading, user, location])

  if (loading) {
    return <div>Verificando autenticação...</div>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}
