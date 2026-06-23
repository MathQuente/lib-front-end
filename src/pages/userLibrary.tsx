import { ToastContainer } from 'react-toastify'
import { UserProfileDisplay } from '../components/userGamesComponents/userProfileDisplay'
import { UserGamesDiv } from '../components/UserGamesDiv'
import { useUserGames } from '../hooks/useUserGames'

export function UserLibrary() {
  const { UserGamesResponse, gamesByStatus, totalPerStatus } = useUserGames()

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

      <ToastContainer />
    </>
  )
}
