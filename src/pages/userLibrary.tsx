import { ToastContainer } from 'react-toastify'
import { UserProfileDisplay } from '../components/userGamesComponents/userProfileDisplay'
import { UserGamesDiv } from '../components/UserGamesDiv'
import { useUserGames } from '../hooks/useUserGames'

export function UserLibrary() {
  const { UserGamesResponse } = useUserGames()

  if (!UserGamesResponse) {
    return null
  }

  return (
    <>
      <UserProfileDisplay />

      <UserGamesDiv
        Games={UserGamesResponse.games}
        totalPerStatus={UserGamesResponse.totalPerStatus}
      />

      <ToastContainer />
    </>
  )
}
