import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Home, Library, Gamepad2, LogOut } from 'lucide-react'
import { buttonClasses } from './button'
import { SearchBar } from './searchBar'
import { api } from '../hooks/useApi'
import logo from '../assets/euzerei-logo.svg'
import { focusRing } from '../styles/focus'

const navFocus = `${focusRing} rounded-sm`

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 text-base py-2 transition-colors ${navFocus} ${
    isActive
      ? 'text-white font-semibold'
      : 'text-gray-300 hover:text-white'
  }`

const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${navFocus} ${
    isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
  }`

export function SideBar() {
  const { user } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const menuButton = menuButtonRef.current
    const focusable = () =>
      Array.from(
        asideRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled])'
        ) ?? []
      )

    focusable()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      menuButton?.focus()
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    api.logout()
    setMobileMenuOpen(false)
  }

  const isLoggedIn = !!user?.id

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="flex md:hidden items-center justify-between w-full py-2 border-b border-dark-border mb-4">
        <Link to="/" className={focusRing}>
          <div>
            <img src={logo} alt="EuZerei" className="h-7 w-auto" />
          </div>
        </Link>
        <button
          ref={menuButtonRef}
          className={`p-2 text-gray-400 hover:text-white transition-colors ${navFocus}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          title="Abrir menu"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileMenuOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay intencional
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        ref={asideRef}
        className={`fixed right-0 top-0 h-full w-64 bg-dark-bg-light border-l border-dark-border transform z-50 md:hidden ${
          mobileMenuOpen
            ? 'translate-x-0 visible [transition:transform_300ms_ease-in-out,visibility_0s]'
            : 'invisible translate-x-full [transition:transform_300ms_ease-in-out,visibility_0s_linear_300ms]'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end px-4 py-4 border-b border-dark-border">
            <button
              className={`p-1.5 text-gray-400 hover:text-white transition-colors ${navFocus}`}
              type="button"
              onClick={closeMobileMenu}
              title="Fechar menu"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col px-4 py-4 gap-3 flex-1">
            <SearchBar isMobile={true} onClose={closeMobileMenu} />

            <div className="flex flex-col gap-0.5 mt-1">
              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/"
                    end
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Home className="size-5" aria-hidden="true" />
                    Início
                  </NavLink>
                  <NavLink
                    to="/userLibrary"
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Library className="size-5" aria-hidden="true" />
                    Minha Biblioteca
                  </NavLink>
                  <NavLink
                    to="/games"
                    end
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Gamepad2 className="size-5" aria-hidden="true" />
                    Jogos
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex items-center gap-2 text-base text-gray-400 hover:text-white py-2 text-left transition-colors ${navFocus}`}
                  >
                    <LogOut className="size-5" aria-hidden="true" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    end
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Home className="size-5" aria-hidden="true" />
                    Início
                  </NavLink>
                  <NavLink
                    to="/games"
                    end
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Gamepad2 className="size-5" aria-hidden="true" />
                    Jogos
                  </NavLink>
                  <Link
                    to="/auth?tab=login"
                    onClick={closeMobileMenu}
                    className={`text-base text-gray-300 hover:text-white py-2 transition-colors ${navFocus}`}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/auth?tab=signUp"
                    onClick={closeMobileMenu}
                    className={buttonClasses({
                      className: 'mt-2 min-h-11'
                    })}
                  >
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      <nav className="hidden md:flex items-center justify-between w-full py-3 border-b border-dark-border mb-6">
        <Link to="/" className={focusRing}>
          <div>
            <img src={logo} alt="EuZerei" className="h-7 w-auto" />
          </div>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-5">
            <NavLink to="/" end className={desktopNavLinkClass}>
              Início
            </NavLink>
            <NavLink to="/userLibrary" className={desktopNavLinkClass}>
              Minha Biblioteca
            </NavLink>
            <NavLink to="/games" end className={desktopNavLinkClass}>
              Jogos
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className={`text-sm text-gray-400 hover:text-white transition-colors ${navFocus}`}
            >
              Sair
            </button>
            <SearchBar isMobile={false} />
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <NavLink to="/" end className={desktopNavLinkClass}>
              Início
            </NavLink>
            <NavLink to="/games" end className={desktopNavLinkClass}>
              Jogos
            </NavLink>
            <Link
              to="/auth?tab=login"
              className={`text-sm text-gray-300 hover:text-white transition-colors ${navFocus}`}
            >
              Entrar
            </Link>
            <Link to="/auth?tab=signUp" className={buttonClasses()}>
              Criar conta
            </Link>
            <SearchBar isMobile={false} />
          </div>
        )}
      </nav>
    </>
  )
}
