import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface MobileMenuContextType {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const MobileMenuContext = createContext<
  MobileMenuContextType | undefined
>(undefined)

interface MobileMenuProviderProps {
  children: ReactNode
}

export function MobileMenuProvider(props: MobileMenuProviderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const contextValue = {
    mobileMenuOpen: mobileMenuOpen,
    setMobileMenuOpen: setMobileMenuOpen
  }

  return React.createElement(
    MobileMenuContext.Provider,
    { value: contextValue },
    props.children
  )
}
