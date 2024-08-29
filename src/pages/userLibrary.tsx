import { useEffect, useState } from 'react'
import { PiGameControllerBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { Cookies } from 'typescript-cookie'
import SideBar from '../components/sideBar'
import { UserGameModal } from '../components/userGamesComponents/userGameModal'
import { UserGamesForm } from '../components/userGamesComponents/userGamesForm'
import { UserProfileForm } from '../components/userGamesComponents/userProfileForm'
import { UserProfileModal } from '../components/userGamesComponents/userProfileModal'
import { Game, User, UserGame } from '../types'
import { ToastContainer } from 'react-toastify'

export function UserLibrary() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [playingGame, setPlayingGame] = useState<UserGame[]>([])
  const [finishedGame, setFinishedGame] = useState<UserGame[]>([])
  const [pausedGame, setPausedGame] = useState<UserGame[]>([])
  const [user, setUser] = useState<User>()
  const [totalGames, setTotalGames] = useState(0)

  const [userGames, setUserGames] = useState<UserGame[]>([])

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const url = new URL(`http://localhost:3333/users/${userId}/userGames`)

    fetch(url, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        setUserGames(data.userGames)
        setTotalGames(data.total)
      })
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    const url = new URL(`http://localhost:3333/users/${userId}`)

    fetch(url, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        setUser(data.user)
        setIsLoading(false)
      })
  }, [userId])

  useEffect(() => {
    setPlayingGame(
      userGames.filter(
        UserGameStatus => UserGameStatus.UserGamesStatus.status === 'playing'
      )
    )
    setFinishedGame(
      userGames.filter(
        UserGameStatus => UserGameStatus.UserGamesStatus.status === 'finished'
      )
    )
    setPausedGame(
      userGames.filter(
        UserGameStatus => UserGameStatus.UserGamesStatus.status === 'paused'
      )
    )
  }, [userGames])

  function removeGame(id: string | undefined) {
    if (!id) return

    setPlayingGame((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )
    setFinishedGame((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )
    setPausedGame((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )

    setTotalGames(previous => previous - 1)
  }

  function updateGame(id: string | undefined, gameStatus: string | undefined) {
    if (!id) return

    setPlayingGame((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )
    setFinishedGame((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )
    setPausedGame((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )

    const updatedGame = userGames.find(({ game }) => game.id === id)
    if (updatedGame) {
      if (gameStatus === '1') {
        setFinishedGame((oldData: UserGame[]) => [updatedGame, ...oldData])
      } else if (gameStatus === '2') {
        setPlayingGame((oldData: UserGame[]) => [updatedGame, ...oldData])
      } else if (gameStatus === '3') {
        setPausedGame((oldData: UserGame[]) => [updatedGame, ...oldData])
      }
    }
  }

  const finishedGames = finishedGame.slice(0, 6)
  const playingGames = playingGame.slice(0, 6)
  const pausedGames = pausedGame.slice(0, 5)

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />

        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-col w-[600px] h-[270px] gap-4 rounded border-zinc-500 border-2 bg-[#272932]">
            <div className="relative w-full">
              {user?.userBanner ? (
                <img
                  src={user?.userBanner}
                  alt=""
                  className="w-full h-[150px] object-cover"
                />
              ) : (
                <div className="w-full h-[150px] bg-[#272932]"></div>
              )}
              <div className="absolute top-[105px] left-[12%] transform -translate-x-1/2 size-28 bg-[#272932] rounded-full flex items-center justify-center">
                <img
                  src={user?.profilePicture}
                  alt=""
                  className="size-24 rounded-full"
                />
              </div>
            </div>
            <div className="w-full flex justify-end px-4">
              <button
                onClick={() => {
                  setIsOpen(true)
                }}
                className="p-2 rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
              hover:from-[#5D23A5] hover:to-[#813FCF]
               text-white font-semibold w-32"
              >
                Editar perfil
              </button>
              <UserProfileModal
                open={isOpen}
                onOpenChange={isOpen => {
                  setIsOpen(isOpen)
                }}
              >
                <UserProfileForm
                  afterSave={() => {
                    setIsOpen(false)
                    const url = new URL(`http://localhost:3333/users/${userId}`)

                    fetch(url, {
                      headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`
                      }
                    })
                      .then(response => response.json())
                      .then(data => {
                        setUser(data.user)
                      })
                  }}
                />
              </UserProfileModal>
            </div>
            <div className="flex justify-start w-full ml-8 gap-2">
              <p className="text-white font-semibold">{user?.userName}</p>|
              <p className="text-white font-semibold">Games: {totalGames}</p>
            </div>
          </div>
          {isLoading ? (
            <div className="min-w-[1440px] h-[300px] bg-[#272932]">
              Loading...
            </div>
          ) : (
            <div className="flex flex-col mt-10 bg-[#272932] p-8">
              <div className="flex flex-row gap-2 justify-between items-center">
                <div className="flex flex-row gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-white">Finished</h1>
                  <div className="flex flex-row items-center gap-1">
                    <PiGameControllerBold className="size-6 text-white" />
                    <p className="text-base text-white font-bold">
                      {finishedGame?.length}
                    </p>
                  </div>
                </div>
                <div>
                  {finishedGame.length > 0 && (
                    <Link
                      to="/userLibrary/finishedGames"
                      className="text-[#8F8F8F]"
                    >
                      Show all
                    </Link>
                  )}
                </div>
              </div>

              <div
                className={`min-w-[1440px] h-[300px] ${
                  finishedGame.length > 0
                    ? 'flex flex-row gap-4'
                    : 'flex flex-row gap-4 justify-center items-center'
                }`}
              >
                {finishedGame.length > 0 ? (
                  finishedGames.map(({ game }: UserGame) => (
                    <div key={game.id}>
                      <button
                        onClick={() => {
                          setCurrentGame(game)
                          setOpen(true)
                        }}
                      >
                        <img
                          className="max-w-56 max-h-80"
                          src={game.gameBanner}
                          alt=""
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <h2 className="text-black font-bold text-3xl">
                    Sem jogos adicionados. Procure jogos{' '}
                    <Link to="/games" className="text-red-500">
                      aqui.
                    </Link>
                  </h2>
                )}
                <div>
                  <UserGameModal
                    open={open}
                    onOpenChange={open => {
                      setOpen(open)
                    }}
                  >
                    <UserGamesForm
                      game={currentGame}
                      afterSave={() => {
                        setOpen(false)
                      }}
                      remove={removeGame}
                      update={updateGame}
                    />
                  </UserGameModal>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col mt-10 bg-[#272932] p-8">
            <div className="flex flex-row gap-2 justify-between items-center">
              <div className="flex flex-row gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">Playing</h1>
                <div className="flex flex-row items-center gap-1">
                  <PiGameControllerBold className="size-6 text-white" />
                  <p className="text-base text-white font-bold">
                    {playingGame?.length}
                  </p>
                </div>
              </div>
              <div>
                {playingGame.length > 0 && (
                  <Link
                    to="/userLibrary/playingGames"
                    className="text-[#8F8F8F]"
                  >
                    Show all
                  </Link>
                )}
              </div>
            </div>
            <div
              className={`min-w-[1440px] h-[300px] ${
                playingGame.length > 0
                  ? 'flex flex-row gap-4'
                  : 'flex flex-row gap-4 justify-center items-center'
              }`}
            >
              {playingGame.length > 0 ? (
                playingGames.map(({ game }: UserGame) => (
                  <div key={game.id}>
                    <button
                      onClick={() => {
                        setCurrentGame(game)
                        setOpen(true)
                      }}
                    >
                      <img
                        className="max-w-56 max-h-80"
                        src={game.gameBanner}
                        alt=""
                      />
                    </button>
                  </div>
                ))
              ) : (
                <h2 className="text-black font-bold text-3xl">
                  Sem jogos adicionados. Procure jogos{' '}
                  <Link to="/games" className="text-red-500">
                    aqui.
                  </Link>
                </h2>
              )}
              <div>
                <UserGameModal
                  open={open}
                  onOpenChange={open => {
                    setOpen(open)
                  }}
                >
                  <UserGamesForm
                    game={currentGame}
                    afterSave={() => {
                      setOpen(false)
                    }}
                    remove={removeGame}
                    update={updateGame}
                  />
                </UserGameModal>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-10 bg-[#272932] p-8 mb-8">
            <div className="flex flex-row gap-2 justify-between items-center">
              <div className="flex flex-row gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">Paused</h1>
                <div className="flex flex-row items-center gap-1">
                  <PiGameControllerBold className="size-6 text-white" />
                  <p className="text-base text-white font-bold">
                    {pausedGame?.length}
                  </p>
                </div>
              </div>
              <div>
                {pausedGame.length > 0 && (
                  <Link
                    to="/userLibrary/playingGames"
                    className="text-[#8F8F8F]"
                  >
                    Show all
                  </Link>
                )}
              </div>
            </div>
            <div
              className={`min-w-[1440px] h-[300px] ${
                pausedGame.length > 0
                  ? 'flex flex-row gap-4'
                  : 'flex flex-row gap-4 justify-center items-center'
              }`}
            >
              {pausedGame.length > 0 ? (
                pausedGames.map(({ game }: UserGame) => (
                  <div key={game.id}>
                    <button
                      onClick={() => {
                        setCurrentGame(game)
                        setOpen(true)
                      }}
                    >
                      <img
                        className="max-w-56 max-h-80"
                        src={game.gameBanner}
                        alt=""
                      />
                    </button>
                  </div>
                ))
              ) : (
                <h2 className="text-black font-bold text-3xl">
                  Sem jogos adicionados. Procure jogos{' '}
                  <Link to="/games" className="text-red-500">
                    aqui.
                  </Link>
                </h2>
              )}
              <div>
                <UserGameModal
                  open={open}
                  onOpenChange={open => {
                    setOpen(open)
                  }}
                >
                  <UserGamesForm
                    game={currentGame}
                    afterSave={() => {
                      setOpen(false)
                    }}
                    remove={removeGame}
                    update={updateGame}
                  />
                </UserGameModal>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
