import { useContext } from 'react'
import { MobileMenuContext } from './mobileMenuContext'

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)

  if (context === undefined) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider')
  }

  return context
}
