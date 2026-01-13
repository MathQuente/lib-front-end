import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'

import { useState, useEffect } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { HiMenu, HiX } from 'react-icons/hi'
import { SearchBar } from './searchBar'
import { useApi } from '../hooks/useApi'
import { useMobileMenu } from '../contexts/useMobileMenu'

export function SideBar() {
  const { user } = useAuth()
  const api = useApi()
  const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu()

  const [isMobile, setIsMobile] = useState(false)
  const [openProfileMenu, setOpenProfileMenu] = useState(false)
  const { UserProfileResponse } = useUserProfile()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, setMobileMenuOpen])

  const handleLogout = async () => {
    api.logout()
    setMobileMenuOpen(false)
  }

  const isLoggedIn = user?.id ?? ''

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  if (isMobile) {
    return (
      <>
        <div className="w-full flex items-center justify-between">
          <h1 className={'overflow-hidden transition-all text-white font-bold'}>
            Logo
          </h1>

          <button
            className="p-2 bg-[#272932] text-white rounded-lg shadow-lg md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-[999]"
            onClick={closeMobileMenu}
          />
        )}

        <aside
          className={`fixed right-0 top-0 h-full w-72 bg-[#272932] transform transition-transform duration-300 ease-in-out z-[1000] md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="h-full flex flex-col border-r shadow-sm">
            <div className="p-3 pb-2 flex justify-between items-center">
              <h1 className="text-white font-bold text-xl">Logo</h1>
              <button
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                type="button"
                onClick={closeMobileMenu}
              >
                <HiX />
              </button>
            </div>

            <div className="flex flex-col border-t">
              {isLoggedIn && UserProfileResponse ? (
                <>
                  <Link
                    to="/userLibrary"
                    className="text-primary hover:text-primary-light pl-3 pt-2"
                    onClick={closeMobileMenu}
                  >
                    My Library
                  </Link>
                  <Link
                    to={'/games'}
                    className="text-primary hover:text-primary-light pl-3"
                    onClick={closeMobileMenu}
                  >
                    Games
                  </Link>
                  <Link
                    onClick={handleLogout}
                    className="text-primary hover:text-primary-light pl-3"
                    to={'/'}
                  >
                    Log out
                  </Link>
                </>
              ) : (
                <div className="flex flex-col px-4 pt-2 gap-1">
                  <Link
                    to={'/auth'}
                    className="text-primary hover:text-primary-light"
                    onClick={closeMobileMenu}
                  >
                    Log in
                  </Link>
                  <Link
                    to={
                      '/auth?tab=signUp                                                                                                                     '
                    }
                    className="text-primary hover:text-primary-light"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>

                  <SearchBar isMobile={isMobile} />
                </div>
              )}
            </div>
          </nav>
        </aside>
      </>
    )
  }

  return (
    <aside className="w-full h-9">
      <nav className="h-full flex items-center justify-between">
        <div className="flex">
          <Link to={'/'}>
            <h1
              className={'overflow-hidden transition-all text-white font-bold'}
            >
              Logo
            </h1>
          </Link>
        </div>

        {isLoggedIn ? (
          <div className="flex gap-3 items-center">
            <div
              onMouseEnter={() => setOpenProfileMenu(true)}
              onMouseLeave={() => setOpenProfileMenu(false)}
              className={`relative ${
                openProfileMenu ? 'bg-dark-bg-lighter rounded-t-md' : ''
              }`}
            >
              <p className="text-primary hover:text-primary-light flex items-center gap-1 px-3 py-2 hover:cursor-pointer">
                {user?.userName}
                <MdKeyboardArrowDown />
              </p>

              {openProfileMenu && (
                <div className="absolute top-full right-0 w-full bg-dark-bg-lighter rounded-b-md shadow-lg flex flex-col gap-1 z-10">
                  <Link
                    to="/userLibrary"
                    className="block text-gray-500 hover:text-white hover:bg-gray-600 transition-colors pl-3"
                  >
                    My Library
                  </Link>
                  <Link
                    onClick={handleLogout}
                    className="block text-gray-500 hover:text-white hover:bg-gray-600 rounded-b-md transition-colors pl-3"
                    to={'/'}
                  >
                    Log out
                  </Link>
                </div>
              )}
            </div>
            <Link
              to={'/games'}
              className="text-primary hover:text-primary-light"
            >
              Games
            </Link>
            <SearchBar isMobile={isMobile} />
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to={'/auth'}
              className="text-primary hover:text-primary-light"
            >
              Log in
            </Link>
            <Link
              to={
                '/auth?tab=signUp                                                                                                                     '
              }
              className="text-primary hover:text-primary-light"
            >
              Register
            </Link>
            <Link
              to={'/games'}
              className="text-primary hover:text-primary-light"
            >
              Games
            </Link>
            <SearchBar isMobile={isMobile} />
          </div>
        )}
      </nav>
    </aside>
  )
}
