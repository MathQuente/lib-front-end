import type { ReactNode } from 'react'

export interface MenuItem {
  key: string
  to: string
  icon: ReactNode
  text: string
  alert?: boolean
  requiresAuth?: boolean
}
