import { useState } from 'react'
import { SideBar } from '../components/sideBar'

import { GameStatusEnum } from '../types/games'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { GameListPage } from '../components/gameListPage'
import { useUserGames } from '../hooks/useUserGames'

type SortField = 'gameName' | 'dateRelease'
type SortOrder = 'asc' | 'desc'

export function UserGamesPageByStatus() {
  const { status } = useParams<{ status: GameStatusEnum }>()
  const navigate = useNavigate()

  const enumToRouteMap: Record<GameStatusEnum, string> = {
    [GameStatusEnum.Played]: 'playedGames',
    [GameStatusEnum.Playing]: 'playingGames',
    [GameStatusEnum.Backlog]: 'backlogGames',
    [GameStatusEnum.Wishlist]: 'wishlistGames'
  }

  const routeToEnumMap: Record<string, GameStatusEnum> = {
    playedGames: GameStatusEnum.Played,
    playingGames: GameStatusEnum.Playing,
    backlogGames: GameStatusEnum.Backlog,
    wishlistGames: GameStatusEnum.Wishlist
  }

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const url = new URL(window.location.toString())
    const v = url.searchParams.get('sortOrder')
    return v === 'desc' ? 'desc' : 'asc'
  })

  const [sortField, setSortField] = useState<SortField>(() => {
    const url = new URL(window.location.toString())
    const v = url.searchParams.get('sortField')
    return v === 'dateRelease' ? 'dateRelease' : 'gameName'
  })

  const [filterField, setFilterField] = useState<GameStatusEnum>(() => {
    return status && status in routeToEnumMap
      ? routeToEnumMap[status]
      : GameStatusEnum.Played
  })

  function handleFilterChange(newFilter: GameStatusEnum) {
    const newRoute = enumToRouteMap[newFilter]
    navigate(`/userLibrary/${newRoute}`)
    setFilterField(newFilter)
  }

  const currentEnumStatus =
    status && status in routeToEnumMap
      ? routeToEnumMap[status]
      : GameStatusEnum.Played

  const { UserGamesResponse } = useUserGames(
    page,
    '',
    currentEnumStatus,
    sortOrder,
    sortField
  )

  return (
    <>
      <div className="flex min-h-screen bg-[#1A1C26]">
        <div className="flex-1 flex flex-col md:ml-0">
          <SideBar />

          {UserGamesResponse && (
            <GameListPage
              games={UserGamesResponse}
              page={page}
              setPage={setPage}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortField={sortField}
              setSortField={setSortField}
              currentStatus={currentEnumStatus}
              filterField={filterField}
              setFilterField={setFilterField}
              onFilterChange={handleFilterChange}
              isUserLibrary
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
