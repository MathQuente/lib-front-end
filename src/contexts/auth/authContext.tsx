import { createContext } from 'react'
import type { User } from '../../types/user'

export interface SignupError {
  field: 'email' | 'password'
  message: string
}

export type AuthContextType = {
  user: Partial<User> | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<SignupError | null>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(null!)
