import { useState } from 'react'
import { UserProfileModal } from './userProfileModal'
import { UserProfileForm } from './userProfileForm'
import { useUserProfile } from '../../hooks/useUserProfile'
import { UserBanner } from './userBanner'
import { UserProfilePicture } from './userProfilePicture'
import { UserInfo } from './userInfo'

export function UserProfileDisplay() {
  const [isOpen, setIsOpen] = useState(false)

  const { UserProfileResponse, isLoading, isError } = useUserProfile()

  if (!UserProfileResponse) {
    return null
  }

  const handleEditProfile = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[350px] h-[180px] ml-24 rounded border-zinc-500 border-2 bg-[#272932]">
        <div className="text-white">Carregando perfil...</div>
      </div>
    )
  }

  if (isError || !UserProfileResponse) {
    return (
      <div className="flex items-center justify-center w-[350px] h-[180px] ml-24 rounded border-zinc-500 border-2 bg-[#272932]">
        <div className="text-red-400">Erro ao carregar perfil</div>
      </div>
    )
  }

  const { user: profileUser } = UserProfileResponse

  return (
    <div
      className="flex flex-col w-[350px] h-[180px] ml-24 sm:w-[350px] sm:h-[200px] md:w-[450px] 
    md:h-[230px] lg:w-[600px] lg:h-[270px] gap-3 rounded border-zinc-500 border-2 bg-[#272932]"
    >
      <div className="relative w-full">
        <UserBanner bannerUrl={profileUser.userBanner} />
        <UserProfilePicture
          profilePicture={profileUser.profilePicture}
          userName={profileUser.userName}
        />
      </div>
      <div className="w-full flex justify-end px-2">
        <button
          type="button"
          onClick={handleEditProfile}
          className="rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
      hover:from-[#5D23A5] hover:to-[#813FCF] text-white font-semibold w-24 sm:w-24 
      sm:p-1 md:w-28 md:p-1"
        >
          Edit Profile
        </button>
        <UserProfileModal open={isOpen} onOpenChange={setIsOpen}>
          <UserProfileForm afterSave={handleCloseModal} />
        </UserProfileModal>
      </div>
      <UserInfo
        userName={profileUser.userName}
        gamesAmount={profileUser.gamesAmount}
      />
    </div>
  )
}
