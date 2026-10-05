import { UserProfileDisplay } from '../components/userGamesComponents/userProfileDisplay'
import { UserGamesDiv } from '../components/UserGamesDiv'
import { usePlatformLinkResult } from '../hooks/usePlatformLinkResult'
import { useUserGames } from '../hooks/useUserGames'

export function UserLibrary() {
  usePlatformLinkResult()
  const { UserGamesResponse, gamesByStatus, totalPerStatus } = useUserGames(
    undefined,
    undefined,
    undefined,
    'desc',
    'completedAt'
  )

  if (!UserGamesResponse) {
    return null
  }

  return (
    <>
      <UserProfileDisplay />

      <UserGamesDiv
        Games={gamesByStatus}
        totalPerStatus={totalPerStatus}
      />
    </>
  )
}
