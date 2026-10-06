import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { safeRedirectPath } from '../utils/safeRedirectPath'

export function PostLoginRedirect() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const stored = sessionStorage.getItem('redirectAfterLogin')
    if (!stored) return

    sessionStorage.removeItem('redirectAfterLogin')
    navigate(safeRedirectPath(stored), { replace: true })
  }, [user, navigate])

  return null
}
