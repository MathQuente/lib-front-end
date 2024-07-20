import SideBar from '../components/sideBar'

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight
} from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Game, GameStatus } from '../types'
import { IconButton } from '../components/iconButton'
import { CiSearch } from 'react-icons/ci'
import GameModal from '../components/gamesComponents/gameModal'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { addGame, updateGameStatus } from '../services/gamesServices'
import { Cookies } from 'typescript-cookie'

export function Games() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const [games, setGames] = useState<Game[]>([])

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const totalPages = Math.ceil(total / 15)

  useEffect(() => {
    const url = new URL('http://localhost:3333/games')
    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setGames(data.games)
        setTotal(data.total)
      })
  }, [page, search])

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

  function goToFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26] ">
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

        <div className="flex flex-col justify-center items-center ml-32 mr-10 mt-8">
          <div className="grid grid-cols-5 gap-7 bg-[#272932] p-12">
            {games.map(game => (
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
              <GameModal
                game={currentGame}
                open={open}
                onOpenChange={open => {
                  setOpen(open)
                }}
              >
                <ContactForm
                  game={currentGame}
                  afterSave={() => {
                    setOpen(false)
                  }}
                />
              </GameModal>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-5 pb-5">
            <p className="text-[#FFFFFF]">
              Mostrando {games?.length} de {total} items
            </p>
            <span className="text-[#FFFFFF]">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-1.5">
              <IconButton onClick={goToFirstPage} disabled={page === 1}>
                <ChevronsLeft className="size-4" />
              </IconButton>
              <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                <ChevronLeft className="size-4 " />
              </IconButton>
              <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                <ChevronRight className="size-4 text-[#6930CD]" />
              </IconButton>
              <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                <ChevronsRight className="size-4 text-[#6930CD]" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ContactForm({
  afterSave,
  game
}: {
  afterSave: () => void
  game: Game | null
}) {
  const [saving, setSaving] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>()

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (game) {
      const url = new URL(
        `http://localhost:3333/userGames/${userId}/${game.id}`
      )

      fetch(url, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      })
        .then(response => response.json())
        .then(data => {
          setGameStatus(data?.UserGamesStatus)
        })
    }
  }, [game, userId])

  function handleStatusChange(value: string) {
    setSelectedStatus(value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    const body = { gameId: game?.id, status: Number(selectedStatus) }
    if (!gameStatus) {
      await addGame(body)
    }

    await updateGameStatus(body)

    afterSave()
  }

  if (game === null) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} key={gameStatus?.id}>
      <fieldset disabled={saving} className="group">
        <div className="mt-8 group-disabled:opacity-50">
          <div className="flex flex-row">
            <img className="w-64 h-80" src={game?.gameBanner} alt="" />
            <div className="flex flex-col gap-1">
              <div
                className={`gap-4 ${
                  game?.categories.length === 1
                    ? 'flex items-center ml-2'
                    : 'grid grid-cols-2 ml-2'
                }`}
              >
                {game?.categories.map((category, index) => (
                  <span
                    className="bg-black rounded-lg text-[#A9A9AD] font-bold flex justify-center items-center h-12 w-36 p-1"
                    key={index}
                  >
                    {category.categoryName}
                  </span>
                ))}
              </div>
              <div
                className={`gap-4 pt-4 ${
                  game?.platforms.length === 1 || game?.platforms.length === 2
                    ? 'flex items-center ml-2'
                    : 'grid grid-cols-2 ml-2'
                }`}
              >
                {game?.platforms.map((platform, index) => (
                  <span
                    className="bg-[#6930CD] flex justify-center items-center h-12 w-36 p-1 rounded-lg text-zinc-950 font-bold"
                    key={index}
                  >
                    {platform.platformName}
                  </span>
                ))}
              </div>
              <div className="flex flex-row gap-2 pt-2 ml-2">
                <h3>Developer:</h3>
                <span>{game?.gameStudio.studioName}</span>
              </div>
              <div className="flex ml-3">
                <RadioGroup.Root
                  className="flex flex-col gap-2.5"
                  defaultValue={gameStatus?.id.toString() ?? ''}
                  onValueChange={handleStatusChange}
                  aria-label="View density"
                >
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
                      value="1"
                      id="1"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-violet11" />
                    </RadioGroup.Item>
                    <label
                      className="text-white text-[15px] leading-none pl-[15px]"
                      htmlFor="1"
                    >
                      playing
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
                      value="2"
                      id="2"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-violet11" />
                    </RadioGroup.Item>
                    <label
                      className="text-white text-[15px] leading-none pl-[15px]"
                      htmlFor="2"
                    >
                      paused
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
                      value="3"
                      id="3"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-violet11" />
                    </RadioGroup.Item>
                    <label
                      className="text-white text-[15px] leading-none pl-[15px]"
                      htmlFor="3"
                    >
                      finished
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 space-x-6 text-right">
          <GameModal.Close className="rounded px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-600">
            Cancel
          </GameModal.Close>
          <button className="inline-flex items-center justify-center rounded bg-[#6930CD] px-4 py-2 text-sm font-medium text-[#A9A9AD] hover:bg-green-600 group-disabled:pointer-events-none">
            {/* <Spinner className="absolute h-4 group-enabled:opacity-0" /> */}
            <span className="group-disabled:opacity-0">Save</span>
          </button>
        </div>
      </fieldset>
    </form>
  )
}
