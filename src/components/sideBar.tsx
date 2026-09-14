import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import { Menu, X, Home, Library, Gamepad2, LogOut } from 'lucide-react'
import { SearchBar } from './searchBar'
import { api } from '../hooks/useApi'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm'

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 text-base py-2 transition-colors ${focusRing} ${
    isActive
      ? 'text-white font-semibold'
      : 'text-primary hover:text-primary-light'
  }`

const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${focusRing} ${
    isActive
      ? 'text-white font-semibold'
      : 'text-primary hover:text-primary-light'
  }`

export function SideBar() {
  const { user } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
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
          <h1 className="font-bold text-white">
            <span className="text-primary">Lib</span>
          </h1>
        </Link>
        <button
          className={`p-2 text-gray-400 hover:text-white transition-colors ${focusRing}`}
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
        className={`fixed right-0 top-0 h-full w-64 bg-dark-bg-light border-l border-dark-border transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end px-4 py-4 border-b border-dark-border">
            <button
              className={`p-1.5 text-gray-400 hover:text-white transition-colors ${focusRing}`}
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
                    Home
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
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Gamepad2 className="size-5" aria-hidden="true" />
                    Games
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex items-center gap-2 text-base text-gray-400 hover:text-white py-2 text-left transition-colors ${focusRing}`}
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
                    Home
                  </NavLink>
                  <Link
                    to="/auth?tab=login"
                    onClick={closeMobileMenu}
                    className={`text-base text-primary hover:text-primary-light py-2 transition-colors ${focusRing}`}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/auth?tab=signUp"
                    onClick={closeMobileMenu}
                    className={`text-base text-primary hover:text-primary-light py-2 transition-colors ${focusRing}`}
                  >
                    Criar conta
                  </Link>
                  <NavLink
                    to="/games"
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    <Gamepad2 className="size-5" aria-hidden="true" />
                    Games
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      <nav className="hidden md:flex items-center justify-between w-full py-3 border-b border-dark-border mb-6">
        <Link to="/" className={focusRing}>
          <h1 className="font-bold text-white">
            <span className="text-primary">Lib</span>
          </h1>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-5">
            <NavLink to="/" end className={desktopNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/userLibrary" className={desktopNavLinkClass}>
              Minha Biblioteca
            </NavLink>
            <NavLink to="/games" className={desktopNavLinkClass}>
              Games
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className={`text-sm text-gray-400 hover:text-white transition-colors ${focusRing}`}
            >
              Sair
            </button>
            <SearchBar isMobile={false} />
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <NavLink to="/" end className={desktopNavLinkClass}>
              Home
            </NavLink>
            <Link
              to="/auth?tab=login"
              className={`text-sm text-primary hover:text-primary-light transition-colors ${focusRing}`}
            >
              Entrar
            </Link>
            <Link
              to="/auth?tab=signUp"
              className={`text-sm text-primary hover:text-primary-light transition-colors ${focusRing}`}
            >
              Criar conta
            </Link>
            <NavLink to="/games" className={desktopNavLinkClass}>
              Games
            </NavLink>
            <SearchBar isMobile={false} />
          </div>
        )}
      </nav>
    </>
  )
}
