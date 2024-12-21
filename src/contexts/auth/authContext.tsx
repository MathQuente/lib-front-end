import { createContext } from 'react'
import type { User } from '../../types/user'

export type AuthContextType = {
  user: Partial<User> | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(null!)
