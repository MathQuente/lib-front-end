import { useState } from 'react'
import { GameStatusEnum } from '../types/games'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { GameListPage } from '../components/gameListPage'
import { useUserGames } from '../hooks/useUserGames'
import type { SortField, SortOrder } from '../interfaces/games'
import type { UseGamesProps } from '../hooks/useGames'

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
    return v === 'releaseDate' ? 'releaseDate' : v === 'rating' ? 'rating' : 'name'
  })

  const [filterField, setFilterField] = useState<GameStatusEnum>(() => {
    return status && status in routeToEnumMap
      ? routeToEnumMap[status]
      : GameStatusEnum.Played
  })

  function handleFilterChange(newFilter: GameStatusEnum | '') {
    if (!newFilter) {
      navigate('/userLibrary')
      return
    }
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

  const gamesForList: UseGamesProps = {
    games: UserGamesResponse?.userGames ?? [],
    total: UserGamesResponse?.total ?? 0
  }

  return (
    <>
      {UserGamesResponse && (
        <GameListPage
          games={gamesForList}
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
      <ToastContainer />
    </>
  )
}
