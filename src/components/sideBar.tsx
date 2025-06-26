import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  IoGameController,
  IoLogOut,
  IoHomeSharp,
  IoLibrary,
  IoLogInSharp,
} from 'react-icons/io5'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/auth/authContext'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import type { UserProfileResponse } from '../types/user'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'

// Typescript interfaces
interface MenuItem {
  key: string
  to: string
  icon: ReactNode
  text: string
  alert?: boolean
  requiresAuth?: boolean
}

interface SidebarItemProps extends MenuItem {
  active: boolean
}

interface SidebarContextProps {
  expanded: boolean
}

// Create context for sidebar expansion state
const SidebarContext = createContext<SidebarContextProps>({ expanded: true })

// Static menu configuration
const menuItems: MenuItem[] = [
  { key: 'home', to: '/', icon: <IoHomeSharp size={20} />, text: 'Home' },
  {
    key: 'games',
    to: '/games',
    icon: <IoGameController size={20} />,
    text: 'Games',
  },
  {
    key: 'library',
    to: '/userLibrary',
    icon: <IoLibrary size={20} />,
    text: 'Library',
    requiresAuth: true,
  },
]

const loginItem: MenuItem = {
  key: 'login',
  to: '/auth',
  icon: <IoLogInSharp className="text-[#7A38CA]" size={20} />,
  text: 'Entrar',
}

export function SideBar() {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [expanded, setExpanded] = useState<boolean>(() => {
    // Tenta recuperar o estado do sessionStorage, default true
    const saved = sessionStorage.getItem('sidebar-expanded')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    sessionStorage.setItem('sidebar-expanded', JSON.stringify(expanded))
  }, [expanded])

  const { data: UserProfileResponse } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => api.getUserProfile(userId),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  })

  const handleLogout = async () => {
    auth.logout()
    navigate('/auth')
  }

  const isLoggedIn = !!userId

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className="fixed h-screen">
        <nav className="h-full flex flex-col bg-[#272932] border-r shadow-sm">
          {/* Header */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <h1
              className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
            >
              Logo
            </h1>
            <button
              type="button"
              onClick={() => setExpanded(curr => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Static Menu Items */}
          <ul className="flex-1 px-3">
            {menuItems
              .filter(item => !item.requiresAuth || isLoggedIn)
              .map(item => {
                const { key, ...restItem } = item
                return (
                  <SidebarItem
                    key={key}
                    {...restItem}
                    active={location.pathname === item.to}
                  />
                )
              })}
          </ul>

          {/* Footer / Profile & Logout */}
          <div className="border-t flex p-3 items-center">
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
                  className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
                >
                  <div className="leading-4">
                    <h4 className="font-semibold">
                      {UserProfileResponse.user.userName}
                    </h4>
                    <span className="text-xs text-gray-600">
                      {UserProfileResponse.user.email}
                    </span>
                  </div>

                  <button type="button" onClick={handleLogout} className="ml-4">
                    <IoLogOut className="text-[#7A38CA]" size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="">
                {(() => {
                  const { key, ...loginProps } = loginItem
                  return (
                    <SidebarItem
                      key={key} // passa a key diretamente
                      {...loginProps} // espalha apenas as props “to”, “icon”, “text”, etc
                      active={location.pathname === loginItem.to}
                    />
                  )
                })()}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  )
}

export function SidebarItem({
  to,
  icon,
  text,
  active,
  alert = false,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext)

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-[#7A38CA]'
          : 'hover:bg-indigo-50 text-gray-600'
      }`}
    >
      <Link to={to} className="flex items-center w-full">
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`}
          />
        )}
      </Link>
      {!expanded && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </li>
  )
}
