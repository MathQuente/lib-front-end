import { ChangeEvent, useEffect, useState } from 'react'
import { CiPause1, CiSearch } from 'react-icons/ci'
import { FaFlagCheckered } from 'react-icons/fa6'
import { PiGameControllerBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { Cookies } from 'typescript-cookie'
import SideBar from '../components/sideBar'
import UserGameModal from '../components/userGamesComponents/userGameModal'
import { Game, UserGame } from '../types'
import { UserGamesForm } from '../components/userGamesComponents/userGamesForm'

export function UserLibrary() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)
  const [playingGame, setPlayingGame] = useState<UserGame[]>([])
  const [finishedGame, setFinishedGame] = useState<UserGame[]>([])
  const [pausedGame, setPausedGame] = useState<UserGame[]>([])

  const [userGames, setUserGames] = useState<UserGame[]>([])

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const url = new URL(`http://localhost:3333/users/${userId}/userGames`)
    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        setUserGames(data.userGames)
      })
  }, [page, search, userId])

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)
    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('search', search)

    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

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

  const playingGames = playingGame.slice(0, 5)

  const finishedGames = finishedGame.slice(0, 5)

  const pausedGames = pausedGame.slice(0, 5)

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />

        <div className="flex gap-3 items-center">
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
        </div>
        <div className="flex flex-col mt-10 mx-52 bg-[#272932] p-8">
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-row gap-2 items-center mb-2">
              <h1 className="text-2xl font-bold text-white">Playing</h1>
              <div className="flex flex-row items-center gap-1">
                <PiGameControllerBold className="size-4 text-white" />
                <p className="text-sm text-white font-bold">
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
                Mostrar tudo
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {playingGames.map(({ game }: UserGame) => (
              <div key={game.id}>
                <button
                  onClick={() => {
                    setCurrentGame(game)
                    setOpen(true)
                  }}
                >
                  <img src={game.gameBanner} alt="" />
                </button>
              </div>
            ))}
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
                />
              </UserGameModal>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10 mx-52 bg-[#272932] p-8">
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-row gap-2 items-center mb-2">
              <h1 className="text-2xl font-bold text-white">Finished</h1>
              <div className="flex flex-row items-center gap-1">
                <FaFlagCheckered className="size-4 text-white" />
                <p className="text-sm text-white font-bold">
                  {finishedGames?.length}
                </p>
              </div>
            </div>
            <div>
              <Link
                to="/userLibrary/playingGames"
                className="text-[#8F8F8F]"
                state={finishedGame}
              >
                Mostrar tudo
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {finishedGames.map(({ game }: UserGame) => (
              <div key={game.id}>
                <button
                  onClick={() => {
                    setCurrentGame(game)
                    setOpen(true)
                  }}
                >
                  <img src={game.gameBanner} alt="" />
                </button>
              </div>
            ))}
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
                />
              </UserGameModal>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10 mx-52 bg-[#272932] p-8">
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-row gap-2 items-center mb-2">
              <h1 className="text-2xl font-bold text-white">Playing</h1>
              <div className="flex flex-row items-center gap-1">
                <CiPause1 className="size-4 text-white" />
                <p className="text-sm text-white font-bold">
                  {pausedGames?.length}
                </p>
              </div>
            </div>
            <div>
              <Link
                to="/userLibrary/playingGames"
                className="text-[#8F8F8F]"
                state={pausedGame}
              >
                Mostrar tudo
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {pausedGames.map(({ game }: UserGame) => (
              <div key={game.id}>
                <button
                  onClick={() => {
                    setCurrentGame(game)
                    setOpen(true)
                  }}
                >
                  <img src={game.gameBanner} alt="" />
                </button>
              </div>
            ))}
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
                />
              </UserGameModal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
