import { useState } from 'react'
import { UserProfileModal } from './userProfileModal'
import { UserProfileForm } from './userProfileForm'
import { UserListModal } from '../userListModal'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useFollowers } from '../../hooks/useFollowers'
import { useFollowing } from '../../hooks/useFollowing'
import { useFollow } from '../../hooks/useFollow'
import { UserBanner } from './userBanner'
import { UserProfilePicture } from './userProfilePicture'
import { UserInfo } from './userInfo'
import { Button } from '../button'
import { UserMinus } from 'lucide-react'

export function UserProfileDisplay() {
  const [isOpen, setIsOpen] = useState(false)
  const [followersModalOpen, setFollowersModalOpen] = useState(false)
  const [followingModalOpen, setFollowingModalOpen] = useState(false)
  const { UserProfileResponse, isLoading, isError } = useUserProfile()
  const userId = UserProfileResponse?.user.id
  const { followers } = useFollowers(userId)
  const { following } = useFollowing(userId)

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
            totalHoursPlayed={profileUser.totalHoursPlayed}
            followersCount={profileUser.followersCount}
            followingCount={profileUser.followingCount}
            onFollowersClick={() => setFollowersModalOpen(true)}
            onFollowingClick={() => setFollowingModalOpen(true)}
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

      <UserListModal
        open={followersModalOpen}
        onOpenChange={setFollowersModalOpen}
        title="Seguidores"
        users={followers}
      />

      <UserListModal
        open={followingModalOpen}
        onOpenChange={setFollowingModalOpen}
        title="Seguindo"
        users={following}
        renderAction={user => <UnfollowButton userId={user.id} />}
      />
    </>
  )
}

function UnfollowButton({ userId }: { userId: string }) {
  const { unfollow, isMutating } = useFollow(userId)

  return (
    <button
      type="button"
      onClick={() => unfollow()}
      disabled={isMutating}
      title="Deixar de seguir"
      aria-label="Deixar de seguir"
      className="flex items-center justify-center size-6 rounded-full text-gray-400 hover:text-red-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50"
    >
      <UserMinus className="size-3.5" aria-hidden="true" />
    </button>
  )
}
