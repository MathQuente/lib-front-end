import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../hooks/useApi'
import { usePublicUserGames } from '../hooks/usePublicUserGames'
import { useFollowers } from '../hooks/useFollowers'
import { useFollowing } from '../hooks/useFollowing'
import { UserBanner } from '../components/userGamesComponents/userBanner'
import { UserProfilePicture } from '../components/userGamesComponents/userProfilePicture'
import { UserInfo } from '../components/userGamesComponents/userInfo'
import { UserGamesDiv } from '../components/UserGamesDiv'
import { FollowActionButton } from '../components/followActionButton'
import { UserListModal } from '../components/userListModal'
import { BackButton } from '../components/backButton'

export function UserProfilePage() {
  const { userId } = useParams()
  const [followersModalOpen, setFollowersModalOpen] = useState(false)
  const [followingModalOpen, setFollowingModalOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['publicUserProfile', userId],
    queryFn: () => api.getUserProfile(userId ?? null),
    enabled: !!userId
  })

  const { games, totalPerStatus } = usePublicUserGames(userId, true)
  const { followers } = useFollowers(userId)
  const { following } = useFollowing(userId)

  if (isLoading) {
    return (
      <>
        <BackButton className="mt-4" />
        <div className="w-full h-36 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse mt-2" />
      </>
    )
  }

  if (isError || !data) {
    return (
      <>
        <BackButton className="mt-4" />
        <div className="w-full rounded-lg border border-dark-border bg-dark-bg-light px-6 py-4 mt-2">
          <p className="text-red-400 text-sm">Erro ao carregar perfil.</p>
        </div>
      </>
    )
  }

  const { user } = data

  return (
    <>
      <BackButton className="mt-4" />

      <div className="w-full rounded-lg border border-dark-border overflow-hidden mt-2">
        <div className="relative">
          <UserBanner bannerUrl={user.userBanner ?? undefined} />
          <UserProfilePicture
            profilePicture={user.profilePicture ?? undefined}
            userName={user.userName ?? 'Usuário'}
          />
        </div>

        <div className="bg-dark-bg-light px-6 pt-10 md:pt-12 pb-4 flex flex-wrap items-center justify-between gap-3">
          <UserInfo
            userName={user.userName ?? 'Usuário'}
            gamesAmount={user.gamesAmount ?? 0}
            totalHoursPlayed={user.totalHoursPlayed ?? 0}
            followersCount={user.followersCount}
            followingCount={user.followingCount}
            onFollowersClick={() => setFollowersModalOpen(true)}
            onFollowingClick={() => setFollowingModalOpen(true)}
          />
          {userId && <FollowActionButton userId={userId} />}
        </div>
      </div>

      <UserGamesDiv
        Games={games}
        totalPerStatus={totalPerStatus}
        showAllLink={false}
      />

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
      />
    </>
  )
}
