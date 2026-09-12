import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { SearchBar } from './searchBar'
import { api } from '../hooks/useApi'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm'

export function SideBar() {
  const { user } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileProfileMenu, setOpenMobileProfileMenu] = useState(false)

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
    setOpenMobileProfileMenu(false)
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
          <div className="flex items-center justify-between px-4 py-4 border-b border-dark-border">
            <Link to="/" onClick={closeMobileMenu} className={focusRing}>
              <h1 className="font-bold text-white">
                <span className="text-primary">Lib</span>
              </h1>
            </Link>
            <button
              className={`p-1.5 text-gray-400 hover:text-white transition-colors ${focusRing}`}
              type="button"
              onClick={closeMobileMenu}
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
                  <button
                    type="button"
                    className={`flex items-center gap-1 py-2 text-sm text-primary hover:text-primary-light w-full text-left transition-colors ${focusRing}`}
                    onClick={() =>
                      setOpenMobileProfileMenu(!openMobileProfileMenu)
                    }
                  >
                    {user?.userName}
                    <ChevronDown
                      className={`transition-transform duration-150 ${openMobileProfileMenu ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openMobileProfileMenu && (
                    <div className="flex flex-col gap-0.5 pl-3 border-l border-dark-border mb-1">
                      <Link
                        to="/userLibrary"
                        onClick={closeMobileMenu}
                        className={`text-sm text-gray-400 hover:text-white transition-colors py-1.5 ${focusRing}`}
                      >
                        Minha Biblioteca
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`text-sm text-gray-400 hover:text-white transition-colors py-1.5 text-left ${focusRing}`}
                      >
                        Sair
                      </button>
                    </div>
                  )}

                  <Link
                    to="/games"
                    onClick={closeMobileMenu}
                    className={`text-sm text-primary hover:text-primary-light py-2 transition-colors ${focusRing}`}
                  >
                    Games
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?tab=login"
                    onClick={closeMobileMenu}
                    className={`text-sm text-primary hover:text-primary-light py-2 transition-colors ${focusRing}`}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/auth?tab=signUp"
                    onClick={closeMobileMenu}
                    className={`text-sm text-primary hover:text-primary-light py-2 transition-colors ${focusRing}`}
                  >
                    Criar conta
                  </Link>
                  <Link
                    to="/games"
                    onClick={closeMobileMenu}
                    className={`text-sm text-primary hover:text-primary-light py-2 transition-colors ${focusRing}`}
                  >
                    Games
                  </Link>
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
            <Link
              to="/userLibrary"
              className={`text-sm text-primary hover:text-primary-light transition-colors ${focusRing}`}
            >
              Minha Biblioteca
            </Link>
            <Link
              to="/games"
              className={`text-sm text-primary hover:text-primary-light transition-colors ${focusRing}`}
            >
              Games
            </Link>
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
            <Link
              to="/games"
              className={`text-sm text-primary hover:text-primary-light transition-colors ${focusRing}`}
            >
              Games
            </Link>
            <SearchBar isMobile={false} />
          </div>
        )}
      </nav>
    </>
  )
}
