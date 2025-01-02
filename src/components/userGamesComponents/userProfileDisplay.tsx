import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { UserProfileResponse } from '../../types/user'
import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'
import { useApi } from '../../hooks/useApi'
import { useState } from 'react'
import { UserProfileModal } from './userProfileModal'
import { UserProfileForm } from './userProfileForm'
import { useAuth } from '../../hooks/useAuth'

export function UserProfileDisplay() {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const [isOpen, setIsOpen] = useState(false)

  const { data: UserProfileResponse } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => api.getUserProfile(userId),
    placeholderData: keepPreviousData,
  })

  if (!UserProfileResponse) {
    return null
  }

  return (
    <div className="flex flex-col w-[350px] h-[180px] ml-24 sm:w-[350px] sm:h-[200px] md:w-[450px] 
    md:h-[230px] lg:w-[600px] lg:h-[270px] gap-3 rounded border-zinc-500 border-2 bg-[#272932]">
      <div className="relative w-full">
        {UserProfileResponse ? (
          UserProfileResponse.user.userBanner ? (
            <img
              src={UserProfileResponse.user.userBanner}
              alt=""
              className="w-full h-[90px] sm:h-[100px] md:h-[120px] lg:h-[150px] object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-[650px] h-[150px]">
              {' '}
            </div>
          )
        ) : (
          <div className="w-full h-[150px] bg-[#272932]"></div>
        )}
        <div className="absolute top-[58px] left-[16%] sm:top-[60px] sm:left-[16%] md:top-[70px] lg:top-[90px] 
        lg:left-[15%] md:left-[16%] transform -translate-x-1/2 size-16 sm:size-20 md:size-24 lg:size-28 
        bg-[#272932] rounded-full flex items-center justify-center">
          <img
            src={
              UserProfileResponse.user.profilePicture ||
              userProfilePictureDefault
            }
            alt=""
            className="size-14 sm:size-16 md:size-20 lg:size-24 rounded-full"
          />
        </div>
      </div>
      <div className="w-full flex justify-end px-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true)
          }}
          className="rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
      hover:from-[#5D23A5] hover:to-[#813FCF] text-white font-semibold w-24 sm:w-24 
      sm:p-1 md:w-28 md:p-1"
        >
          Editar perfil
        </button>
        <UserProfileModal
          open={isOpen}
          onOpenChange={isOpen => {
            setIsOpen(isOpen)
          }}
        >
          <UserProfileForm
            afterSave={() => {
              setIsOpen(false)
            }}
          />
        </UserProfileModal>
      </div>
      <div className="flex justify-start w-full ml-4 gap-2">
        <p className="text-white font-semibold">
          {UserProfileResponse.user.userName}
        </p>
        |
        <p className="text-white font-semibold">
          Games: {UserProfileResponse.user.gamesAmount}
        </p>
      </div>
    </div>
  )
}
