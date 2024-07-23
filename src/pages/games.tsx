import SideBar from '../components/sideBar'

import * as Collapsible from '@radix-ui/react-collapsible'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DotIcon
} from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { Cookies } from 'typescript-cookie'
import GameModal from '../components/gamesComponents/gameModal'
import { IconButton } from '../components/iconButton'
import { addGame, updateGameStatus } from '../services/gamesServices'
import { Game, GameStatus } from '../types'
import { RxCross1, RxRowSpacing } from 'react-icons/rx'

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
  const [open, setOpen] = useState(false)

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

          setSelectedStatus(data?.UserGamesStatus.id.toString())
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
    <form onSubmit={handleSubmit} key={gameStatus?.id} className="">
      <fieldset disabled={saving} className="group">
        <div className="group-disabled:opacity-50 flex w-[649px] h-[430px]">
          <img
            className="-ml-12 -mt-4 rounded-l-lg"
            src={game?.gameBanner}
            alt=""
          />
          <div className="flex flex-col gap-1 items-center">
            <div className="flex flex-col items-center mt-2">
              <div className="ml-10 -mt-4">
                <h2 className="text-3xl font-bold">{game.gameName}</h2>
              </div>
              <div className="mt-2 relative">
                <Collapsible.Root
                  className="w-full md:w-[300px] md:ml-6"
                  open={open}
                  onOpenChange={setOpen}
                >
                  {game?.platforms.length === 1 && (
                    <div className="grid grid-flow-col ml-4">
                      <span
                        className="text-violet11 text-xl mx-auto leading-[25px]"
                        style={{ color: 'white' }}
                      >
                        Platforms
                      </span>
                    </div>
                  )}
                  {game?.platforms.length > 2 && (
                    <div className="grid grid-flow-col ml-16">
                      <span
                        className="text-violet11 text-2xl font-semibold mx-auto leading-[25px]"
                        style={{ color: 'white' }}
                      >
                        Platforms
                      </span>
                      <Collapsible.Trigger asChild>
                        <button className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet3 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black">
                          {open ? <RxCross1 /> : <RxRowSpacing />}
                        </button>
                      </Collapsible.Trigger>
                    </div>
                  )}

                  <div
                    className={`${
                      game?.platforms.length === 1
                        ? 'flex justify-center  ml-2'
                        : 'grid grid-cols-2 gap-x-10 gap-y-1 mt-2'
                    }`}
                  >
                    {game?.platforms.slice(0, 2).map((platform, index) => (
                      <div
                        className="bg-violet11 rounded my-1 p-1 shadow-[0_2px_10px] flex justify-center w-40 shadow-blackA4"
                        key={index}
                      >
                        <span className="text-white text-xl leading-[25px]">
                          {platform.platformName}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Collapsible.Content
                    className={`${
                      game?.platforms.length === 1
                        ? 'flex justify-center'
                        : 'grid grid-cols-2  gap-x-10 gap-y-1'
                    } absolute bg-[#272932]  `}
                  >
                    {game?.platforms.slice(2).map((platform, index) => (
                      <div
                        className="bg-violet11 rounded my-1 p-1 shadow-[0_2px_10px] flex justify-center w-40 shadow-blackA4"
                        key={index}
                      >
                        <span className="text-white text-xl leading-[25px]">
                          {platform.platformName}
                        </span>
                      </div>
                    ))}
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </div>

            <div className="flex gap-2 my-10 ml-4">
              <h1 className="text-2xl font font-normal">Tags:</h1>
              <div className="flex flex-row gap-2">
                {game?.categories.map((category, index) => (
                  <span
                    className="bg-black rounded-lg text-[#A9A9AD] font-bold text-lg flex justify-center items-center h-8 w-28"
                    key={index}
                  >
                    {category.categoryName}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-2 ml-6 my-auto">
              <h3 className="text-xl">Developer:</h3>
              <p className="text-xl font-bold">{game?.gameStudio.studioName}</p>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="rounded-md w-28 h-9 inline-flex items-center justify-center text-violet11 bg-white shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black ml-8 text-lg font-medium"
                  aria-label="Customise options"
                >
                  <p>
                    {selectedStatus === '1'
                      ? 'finished'
                      : selectedStatus === '2'
                      ? 'playing'
                      : 'paused'}
                  </p>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-36  bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade "
                  sideOffset={5}
                >
                  <DropdownMenu.RadioGroup
                    value={selectedStatus?.toString()}
                    onValueChange={handleStatusChange}
                  >
                    <DropdownMenu.RadioItem
                      className="text-base leading-none text-violet11 rounded-[3px] flex items-center justify-center h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                      value="1"
                    >
                      <DropdownMenu.ItemIndicator className="absolute left-3 w-[25px] inline-flex items-center justify-center">
                        <DotIcon />
                      </DropdownMenu.ItemIndicator>
                      finished
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      className="text-base leading-none text-violet11 rounded-[3px] flex items-center justify-center h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                      value="2"
                    >
                      <DropdownMenu.ItemIndicator className="absolute left-3 w-[25px] inline-flex items-center justify-center">
                        <DotIcon />
                      </DropdownMenu.ItemIndicator>
                      playing
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      className="text-base leading-none text-violet11 rounded-[3px] flex items-center justify-center h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                      value="3"
                    >
                      <DropdownMenu.ItemIndicator className="absolute left-3 w-[25px] inline-flex items-center justify-center">
                        <DotIcon />
                      </DropdownMenu.ItemIndicator>
                      paused
                    </DropdownMenu.RadioItem>
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <div className="my-auto ml-56">
              <GameModal.Close className="rounded px-4 text-sm font-medium text-gray-500 hover:text-gray-600">
                Cancel
              </GameModal.Close>
              <button className="inline-flex items-center justify-center rounded bg-[#6930CD] px-4 py-2 text-sm font-medium text-white hover:bg-green-600 group-disabled:pointer-events-none">
                {/* <Spinner className="absolute h-4 group-enabled:opacity-0" /> */}
                <span className="group-disabled:opacity-0">Save</span>
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  )
}
