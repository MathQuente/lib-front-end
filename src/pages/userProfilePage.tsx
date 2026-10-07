import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../hooks/useApi'
import { usePublicUserGames } from '../hooks/usePublicUserGames'
import { useFollowers } from '../hooks/useFollowers'
import { useFollowing } from '../hooks/useFollowing'
import { LibraryShelves } from '../components/libraryComponents/libraryShelves'
import { ProfileHeader } from '../components/libraryComponents/profileHeader'
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
    enabled: !!userId,
  })

  const {
    games,
    totalPerStatus,
    isLoading: isLoadingGames,
  } = usePublicUserGames(userId, true)
  const hasGames = totalPerStatus.some(t => t.totalGames > 0)
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

      <ProfileHeader
        userName={user.userName ?? 'Usuário'}
        profilePicture={user.profilePicture}
        bannerUrl={user.userBanner}
        gamesAmount={user.gamesAmount ?? 0}
        totalHoursPlayed={user.totalHoursPlayed ?? 0}
        followersCount={user.followersCount}
        followingCount={user.followingCount}
        onFollowersClick={() => setFollowersModalOpen(true)}
        onFollowingClick={() => setFollowingModalOpen(true)}
        actions={userId && <FollowActionButton userId={userId} />}
      />

      {hasGames ? (
        <LibraryShelves
          games={games}
          totalPerStatus={totalPerStatus}
          readOnly
        />
      ) : (
        !isLoadingGames && (
          <p className="mt-8 text-gray-400">Nenhum jogo na biblioteca ainda.</p>
        )
      )}

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
