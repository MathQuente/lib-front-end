import { useState } from 'react'
import { UserProfileModal } from './userProfileModal'
import { UserProfileForm } from './userProfileForm'
import { useUserProfile } from '../../hooks/useUserProfile'
import { UserBanner } from './userBanner'
import { UserProfilePicture } from './userProfilePicture'
import { UserInfo } from './userInfo'
import { Button } from '../button'

export function UserProfileDisplay() {
  const [isOpen, setIsOpen] = useState(false)
  const { UserProfileResponse, isLoading, isError } = useUserProfile()

  if (isLoading) {
    return (
      <div className="w-full h-36 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse" />
    )
  }

  if (isError || !UserProfileResponse) {
    return (
      <div className="w-full rounded-lg border border-dark-border bg-dark-bg-light px-6 py-4">
        <p className="text-red-400 text-sm">Erro ao carregar perfil.</p>
      </div>
    )
  }

  const { user: profileUser } = UserProfileResponse

  return (
    <>
      <div className="w-full rounded-lg border border-dark-border overflow-hidden">
        <div className="relative">
          <UserBanner bannerUrl={profileUser.userBanner} />
          <UserProfilePicture
            profilePicture={profileUser.profilePicture}
            userName={profileUser.userName}
          />
        </div>

        <div className="bg-dark-bg-light px-6 pt-10 md:pt-12 pb-4 flex items-center justify-between">
          <UserInfo
            userName={profileUser.userName}
            gamesAmount={profileUser.gamesAmount}
          />
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsOpen(true)}
          >
            Editar perfil
          </Button>
        </div>
      </div>

      <UserProfileModal open={isOpen} onOpenChange={setIsOpen}>
        <UserProfileForm
          afterSave={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </UserProfileModal>
    </>
  )
}
