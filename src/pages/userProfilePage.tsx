import { useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
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
import { StatusMessage } from '../components/statusMessage'
import { Button } from '../components/button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function UserProfilePage() {
  const { userId } = useParams()
  const [followersModalOpen, setFollowersModalOpen] = useState(false)
  const [followingModalOpen, setFollowingModalOpen] = useState(false)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['publicUserProfile', userId],
    queryFn: () => api.getUserProfile(userId ?? null),
    enabled: !!userId,
  })

  const {
    games,
    totalPerStatus,
    isLoading: isLoadingGames,
  } = usePublicUserGames(userId, !!data)
  const hasGames = totalPerStatus.some(t => t.totalGames > 0)
  const { followers } = useFollowers(data ? userId : undefined)
  const { following } = useFollowing(data ? userId : undefined)

  useDocumentTitle(isError ? undefined : (data?.user.userName ?? 'Perfil'))

  if (isLoading) {
    return (
      <>
        <BackButton className="mt-4" />
        <div className="w-full h-36 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse mt-2" />
      </>
    )
  }

  const status = isAxiosError(error) ? error.response?.status : undefined
  if (isError && (status === 400 || status === 404)) {
    return (
      <>
        <BackButton className="mt-4" />
        <StatusMessage
          variant="not-found"
          icon="not-found"
          title="Perfil não encontrado"
          description="Essa pessoa não existe ou mudou de endereço. Tente buscar pelo nome."
          showSearch
        />
      </>
    )
  }

  if (isError || !data) {
    return (
      <>
        <BackButton className="mt-4" />
        <StatusMessage
          variant="error"
          icon="offline"
          title="Não foi possível abrir o perfil"
          description="Tente de novo em instantes."
          primaryAction={
            <Button variant="secondary" size="md" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          }
        />
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
