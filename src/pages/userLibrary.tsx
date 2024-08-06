import { useEffect, useState } from 'react'
import { PiGameControllerBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { Cookies } from 'typescript-cookie'
import SideBar from '../components/sideBar'
import { UserGameModal } from '../components/userGamesComponents/userGameModal'
import { UserGamesForm } from '../components/userGamesComponents/userGamesForm'
import { Game, UserGame } from '../types'

import userProfilePictureDefault from '../assets/Default_pfp.svg.png'

export function UserLibrary() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)
  const [playingGame, setPlayingGame] = useState<UserGame[]>([])
  const [finishedGame, setFinishedGame] = useState<UserGame[]>([])
  const [pausedGame, setPausedGame] = useState<UserGame[]>([])

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

  const playingGames = playingGame.slice(0, 5)

  const finishedGames = finishedGame.slice(0, 6)

  const pausedGames = pausedGame.slice(0, 5)

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />

        {/* <div className="flex gap-3 items-center">
          <div className=" left-[20rem] top-[2rem] w-[30rem] mx-44 mt-10">
            <CiSearch className="size-6 text-[#8F8F8F] absolute top-[3.625rem] left-[12.5rem]" />
            <input
              onChange={onSearchInputChange}
              value={search}
              className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full h-[62px] pl-[62px]"
              type="text"
              placeholder="Search"
            />
          </div>
        </div> */}
        <div className="flex flex-col items-center mt-4">
          <Link to="/profile" className="">
            <img
              src={userProfilePictureDefault}
              alt=""
              className="object-fill size-16 rounded-2xl"
            />
          </Link>
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
                <Link
                  to="/userLibrary/playingGames"
                  className="text-[#8F8F8F]"
                  state={finishedGame}
                >
                  Show all
                </Link>
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
          <div className="flex flex-col mt-10 bg-[#272932] p-8">
            <div className="flex flex-row gap-2  justify-between items-center">
              <div className="flex flex-row gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">Playing</h1>
                <div className="flex flex-row items-center gap-1">
                  <PiGameControllerBold className="size-6 text-white" />
                  <p className="text-base text-white font-bold">
                    {playingGames?.length}
                  </p>
                </div>
              </div>
              <div>
                <Link
                  to="/userLibrary/playingGames"
                  className="text-[#8F8F8F]"
                  state={playingGame}
                >
                  Show all
                </Link>
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
                <Link
                  to="/userLibrary/playingGames"
                  className="text-[#8F8F8F]"
                  state={pausedGame}
                >
                  Show all
                </Link>
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
    </>
  )
}
