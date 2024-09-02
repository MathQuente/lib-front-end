import { useContext } from 'react'
import { AuthContext } from './authContext'
import { Authentication } from '../../pages/authentication'

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext)

  if (!auth.user) {
    return <Authentication />
  }

  return children
}
