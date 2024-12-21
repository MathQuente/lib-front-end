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
    <div className="flex flex-col w-[600px] h-[270px] gap-4 rounded border-zinc-500 border-2 bg-[#272932]">
      <div className="relative w-full">
        {UserProfileResponse ? (
          UserProfileResponse.user.userBanner ? (
            <img
              src={UserProfileResponse.user.userBanner}
              alt=""
              className="w-full h-[150px] object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-[650px] h-[150px]">
              {' '}
            </div>
          )
        ) : (
          <div className="w-full h-[150px] bg-[#272932]">s</div>
        )}
        <div className="absolute top-[105px] left-[12%] transform -translate-x-1/2 size-28 bg-[#272932] rounded-full flex items-center justify-center">
          <img
            src={
              UserProfileResponse.user.profilePicture ||
              userProfilePictureDefault
            }
            alt=""
            className="size-24 rounded-full"
          />
        </div>
      </div>
      <div className="w-full flex justify-end px-4">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true)
          }}
          className="p-2 rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
      hover:from-[#5D23A5] hover:to-[#813FCF]
       text-white font-semibold w-32"
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
      <div className="flex justify-start w-full ml-8 gap-2">
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
