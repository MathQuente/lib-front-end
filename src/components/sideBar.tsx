import { Link } from 'react-router-dom'
import { menuItems, loginItem } from '../config/menuItems'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'

import { SideBarItem } from './sidebarItem'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import { useState, useEffect } from 'react'
import { IoArrowDown, IoLogOut } from 'react-icons/io5'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { HiMenu, HiX } from 'react-icons/hi'
import { SearchBar } from './searchBar'
import { useApi } from '../hooks/useApi'

export function SideBar() {
  const { user } = useAuth()
  const api = useApi()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [openProfileMenu, setOpenProfileMenu] = useState(false)
  const { UserProfileResponse } = useUserProfile()

  // const searchInputRef = useRef<HTMLInputElement>(null)

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fecha o menu mobile quando redimensiona para desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  // Previne scroll quando menu mobile está aberto
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

  const handleLogout = async () => {
    api.logout()
    setMobileMenuOpen(false)
  }

  const isLoggedIn = user?.id ?? ''

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Botão hambúrguer para mobile
  if (isMobile) {
    return (
      <>
        {/* Botão hambúrguer fixo */}
        <button
          className="ml-2 mt-2 w-10 h-12 p-2 bg-[#272932] text-white rounded-lg shadow-lg md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
        >
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Overlay */}
        {mobileMenuOpen && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            className="fixed inset-0 bg-black bg-opacity-50  md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar mobile */}
        <aside
          className={`fixed left-0 top-0 h-full w-80 bg-[#272932] transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full flex flex-col border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
              <h1 className="text-white font-bold text-xl">Logo</h1>
              <button
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                type="button"
                onClick={closeMobileMenu}
              >
                <HiX />
              </button>
            </div>

            <div className="px-3 pb-2">
              <SearchBar isMobile={isMobile} />
            </div>

            <ul className="flex-1 px-3">
              {menuItems
                .filter(item => !item.requiresAuth || isLoggedIn)
                .map(item => {
                  const { key, ...restItem } = item
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                    <div key={key} onClick={closeMobileMenu}>
                      <SideBarItem
                        key={key}
                        {...restItem}
                        active={location.pathname === item.to}
                      />
                    </div>
                  )
                })}
            </ul>

            <div className="flex items-center p-3 border-t">
              {isLoggedIn && UserProfileResponse ? (
                <>
                  <Link to="/userLibrary" onClick={closeMobileMenu}>
                    <img
                      src={
                        UserProfileResponse.user.profilePicture === null
                          ? userProfilePictureDefault
                          : UserProfileResponse.user.profilePicture
                      }
                      alt=""
                      className="object-fill size-10 rounded-md"
                    />
                  </Link>
                  <div className="flex justify-between items-center w-full ml-3">
                    <div className="leading-4">
                      <p className="font-semibold text-white">
                        {UserProfileResponse.user.userName}
                      </p>
                      <span className="text-xs text-gray-300">
                        {UserProfileResponse.user.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="ml-4 hover:bg-gray-600 p-2 rounded-md"
                    >
                      <IoLogOut className="text-[#7A38CA]" size={20} />
                    </button>
                  </div>
                </>
              ) : (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <div onClick={closeMobileMenu}>
                  {(() => {
                    const { key, ...loginProps } = loginItem
                    return (
                      <SideBarItem
                        key={key}
                        {...loginProps}
                        active={location.pathname === loginItem.to}
                      />
                    )
                  })()}
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
                    Minha Biblioteca
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
              to={'/auth'}
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
        {/* <ul className="flex-1 px-3">
          {menuItems
            .filter(item => !item.requiresAuth || isLoggedIn)
            .map(item => {
              const { key, ...restItem } = item
              return (
                <SideBarItem
                  key={key}
                  {...restItem}
                  active={location.pathname === item.to}
                />
              )
            })}
        </ul> */}
      </nav>
    </aside>
  )
}
