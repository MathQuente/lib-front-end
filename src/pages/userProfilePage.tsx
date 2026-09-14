import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Lock } from 'lucide-react'
import { api } from '../hooks/useApi'
import { UserBanner } from '../components/userGamesComponents/userBanner'
import { UserProfilePicture } from '../components/userGamesComponents/userProfilePicture'
import { UserInfo } from '../components/userGamesComponents/userInfo'
import { BackButton } from '../components/backButton'

export function UserProfilePage() {
  const { userId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['publicUserProfile', userId],
    queryFn: () => api.getUserProfile(userId ?? null),
    enabled: !!userId
  })

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

      {!user.isPublic ? (
        <div className="w-full rounded-lg border border-dark-border bg-dark-bg-light px-6 py-10 mt-2 flex flex-col items-center gap-2 text-center">
          <Lock className="size-6 text-gray-400" aria-hidden="true" />
          <p className="text-white font-semibold">
            {user.userName ?? 'Este usuário'}
          </p>
          <p className="text-gray-400 text-sm">Este perfil é privado.</p>
        </div>
      ) : (
        <div className="w-full rounded-lg border border-dark-border overflow-hidden mt-2">
          <div className="relative">
            <UserBanner bannerUrl={user.userBanner ?? undefined} />
            <UserProfilePicture
              profilePicture={user.profilePicture ?? undefined}
              userName={user.userName ?? 'Usuário'}
            />
          </div>

          <div className="bg-dark-bg-light px-6 pt-10 md:pt-12 pb-4">
            <UserInfo
              userName={user.userName ?? 'Usuário'}
              gamesAmount={user.gamesAmount ?? 0}
              totalHoursPlayed={user.totalHoursPlayed ?? 0}
            />
          </div>
        </div>
      )}
    </>
  )
}
