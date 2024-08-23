import SideBar from '../components/sideBar'
import { CiSearch } from 'react-icons/ci'
import { ChangeEvent, useEffect, useState } from 'react'
import { IconButton } from '../components/iconButton'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { Game, UserGame } from '../types'
import { Cookies } from 'typescript-cookie'
import { UserGameModal } from '../components/userGamesComponents/userGameModal'
import { UserGamesForm } from '../components/userGamesComponents/userGamesForm'

export function FinishedGamesPage() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)
  const [userFinishedGames, setUserFinishedGames] = useState<UserGame[]>([])
  const [total, setTotal] = useState(0)
  const totalPage = Math.ceil(total / 10) || 1

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
    const url = new URL(
      `http://localhost:3333/users/${userId}/userFinishedGames`
    )

    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        setUserFinishedGames(data.userFinishedGames)
        setTotal(data.total)
      })
  }, [userId, page, search])

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
    setCurrentPage(totalPage)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  function getGames() {
    const url = new URL(
      `http://localhost:3333/users/${userId}/userFinishedGames`
    )

    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        setUserFinishedGames(data.userFinishedGames)
        setTotal(data.total)
      })
  }

  function removeGame(id: string | undefined) {
    if (!id) return

    setUserFinishedGames((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )
    setTotal(previousValue => previousValue - 1)

    getGames()
  }

  function updateGame(id: string | undefined) {
    if (!id) return

    setUserFinishedGames((oldData: UserGame[]) =>
      oldData.filter(({ game }) => game.id !== id)
    )
    setTotal(previousValue => previousValue - 1)
    getGames()
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26]">
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
          <div className="grid grid-cols-5 gap-7 bg-[#272932] p-12 min-h-[800px] w-[1633px]">
            {userFinishedGames.map(({ game }) => (
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
                  update={updateGame}
                />
              </UserGameModal>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-5 pb-5">
            <p className="text-[#FFFFFF]">
              Mostrando {userFinishedGames.length} de {total} items
            </p>
            <span className="text-[#FFFFFF]">
              Página {page} de {totalPage}
            </span>
            <div className="flex gap-1.5">
              <IconButton onClick={goToFirstPage} disabled={page === 1}>
                <ChevronsLeft
                  className={`${
                    page === 1 ? 'size-4 text-black' : 'size-4 text-[#6930CD]'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                <ChevronLeft
                  className={`${
                    page === 1 ? 'size-4 text-black' : 'size-4 text-[#6930CD]'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToNextPage} disabled={page === totalPage}>
                <ChevronRight
                  className={`size-4 ${
                    page === totalPage ? 'text-black' : 'text-[#6930CD]'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToLastPage} disabled={page === totalPage}>
                <ChevronsRight
                  className={`size-4 ${
                    page === totalPage ? 'text-black' : 'text-[#6930CD]'
                  }`}
                />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
