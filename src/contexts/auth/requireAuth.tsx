import { useContext, useEffect } from 'react'
import { AuthContext } from './authContext'
import { Navigate, useLocation } from 'react-router-dom'

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext)
  const location = useLocation()

  useEffect(() => {
    if (!auth.user) {
      localStorage.setItem('redirectAfterLogin', location.pathname)
    }
  }, [auth.user, location])

  if (!auth.user) {
    return <Navigate to="/auth" replace />
  }
  return children
}
