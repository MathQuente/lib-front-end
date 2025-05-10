import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'

import { SideBar } from '../components/sideBar'

import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'

import type { UserGamesResponse } from '../types/user'

import { UserProfileDisplay } from '../components/userGamesComponents/userProfileDisplay'
import { UserGamesDiv } from '../components/UserGamesDiv'

export function UserLibrary() {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const { data: UserGamesResponse } = useQuery<UserGamesResponse>({
    queryKey: ['userGames', userId],
    queryFn: async () => api.getUserGames(userId),
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  if (!UserGamesResponse) {
    return null
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />
        <div className="flex flex-col items-center mt-4">
          <div className="lg:ml-16">
            <UserProfileDisplay />
          </div>

          <UserGamesDiv
            userGames={UserGamesResponse.userGames}
            totalPerStatus={UserGamesResponse.totalPerStatus}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
