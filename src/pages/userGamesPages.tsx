import { useState } from 'react'
import { GameStatusEnum } from '../types/games'
import { useNavigate, useParams } from 'react-router-dom'
import { GameListPage } from '../components/gameListPage'
import { BackButton } from '../components/backButton'
import { useUserGames } from '../hooks/useUserGames'
import type { SortField, SortOrder } from '../interfaces/games'
import type { GameListData } from '../types/games'

const ITEMS_PER_PAGE = 30

export function UserGamesPageByStatus() {
  const { status } = useParams<{ status: GameStatusEnum }>()
  const navigate = useNavigate()

  const enumToRouteMap: Record<GameStatusEnum, string> = {
    [GameStatusEnum.Played]: 'playedGames',
    [GameStatusEnum.Playing]: 'playingGames',
    [GameStatusEnum.Paused]: 'pausedGames',
    [GameStatusEnum.Backlog]: 'backlogGames',
    [GameStatusEnum.Wishlist]: 'wishlistGames'
  }

  const routeToEnumMap: Record<string, GameStatusEnum> = {
    playedGames: GameStatusEnum.Played,
    playingGames: GameStatusEnum.Playing,
    pausedGames: GameStatusEnum.Paused,
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

  const startsOnPlayed =
    (status && routeToEnumMap[status]) === GameStatusEnum.Played

  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const url = new URL(window.location.toString())
    const v = url.searchParams.get('sortOrder')
    if (v === 'asc' || v === 'desc') return v
    return startsOnPlayed ? 'desc' : 'asc'
  })

  const [sortField, setSortField] = useState<SortField>(() => {
    const url = new URL(window.location.toString())
    const v = url.searchParams.get('sortField')
    if (v === 'releaseDate' || v === 'rating' || v === 'name') return v
    return startsOnPlayed ? 'completedAt' : 'name'
  })

  const [filterField, setFilterField] = useState<GameStatusEnum>(() => {
    return status && status in routeToEnumMap
      ? routeToEnumMap[status]
      : GameStatusEnum.Played
  })

  function handleFilterChange(newFilter: GameStatusEnum | '') {
    if (!newFilter) {
      navigate('/userLibrary')
      if (sortField === 'completedAt') {
        setSortField('name')
        setSortOrder('asc')
      }
      return
    }
    const newRoute = enumToRouteMap[newFilter]
    navigate(`/userLibrary/${newRoute}`)
    setFilterField(newFilter)
    if (newFilter === GameStatusEnum.Played) {
      setSortField('completedAt')
      setSortOrder('desc')
    } else if (sortField === 'completedAt') {
      setSortField('name')
      setSortOrder('asc')
    }
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

  const gamesForList: GameListData = {
    games: UserGamesResponse?.games[currentEnumStatus] ?? [],
    total: UserGamesResponse?.total ?? 0
  }

  return (
    <>
      <BackButton className="mt-4" />
      {UserGamesResponse && (
        <GameListPage
          games={gamesForList}
          page={page}
          pageSize={ITEMS_PER_PAGE}
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
    </>
  )
}
