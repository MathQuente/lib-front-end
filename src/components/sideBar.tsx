import { Link } from 'react-router-dom'
import { menuItems, loginItem } from '../config/menuItems'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'

import { SideBarItem } from './sidebarItem'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import { useState, useEffect } from 'react'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { IoLogOut } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi'
import { SearchBar } from './searchBar'
import { useApi } from '../hooks/useApi'

export function SideBar() {
  const { user } = useAuth()
  const api = useApi()
  const [expanded, setExpanded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { UserProfileResponse } = useUserProfile()

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
          className="fixed top-4 left-4 z-50 p-2 bg-[#272932] text-white rounded-lg shadow-lg md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
        >
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Overlay */}
        {mobileMenuOpen && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
                        expanded={true}
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
                        expanded={true}
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

  // Versão desktop (original com pequenos ajustes)
  return (
    <aside className="fixed h-screen z-50 hidden md:block">
      <nav className="h-full flex flex-col bg-[#272932] border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all text-white font-bold ${
              expanded ? 'w-32' : 'w-0'
            }`}
          >
            Logo
          </h1>
          <button
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            type="button"
            onClick={() => setExpanded(curr => !curr)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <div className="px-3 pb-2">
          {expanded ? (
            <SearchBar isMobile={isMobile} />
          ) : (
            <>
              <div className="flex justify-center">
                <button
                  type="button"
                  title="Expand to search"
                  onClick={() => setExpanded(true)}
                  className="group p-3 rounded-lg hover:bg-indigo-50 transition-colors relative"
                >
                  <CiSearch className="text-gray-600" size={20} />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 rounded-md px-2 py-1 ml-6 bg-indigo-100 text-[#7A38CA] text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                    Search
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        <ul className="flex-1 px-3">
          {menuItems
            .filter(item => !item.requiresAuth || isLoggedIn)
            .map(item => {
              const { key, ...restItem } = item
              return (
                <SideBarItem
                  key={key}
                  {...restItem}
                  active={location.pathname === item.to}
                  expanded={expanded}
                />
              )
            })}
        </ul>
        <div className="flex items-center p-3 border-t">
          {isLoggedIn && UserProfileResponse ? (
            <>
              <Link to="/userLibrary">
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
              <div
                className={`flex justify-between items-center overflow-hidden transition-all ${
                  expanded ? 'w-52 ml-3' : 'w-0'
                }`}
              >
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
            <div>
              {(() => {
                const { key, ...loginProps } = loginItem
                return (
                  <SideBarItem
                    key={key}
                    {...loginProps}
                    active={location.pathname === loginItem.to}
                    expanded={expanded}
                  />
                )
              })()}
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
