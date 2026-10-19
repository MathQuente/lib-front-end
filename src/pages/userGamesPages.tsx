import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { GameStatusEnum } from '../types/games'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { parsePage } from '../utils/parsePage'
import { GameListPage } from '../components/gameListPage'
import { BackButton } from '../components/backButton'
import { useUserGames } from '../hooks/useUserGames'
import type { SortField, SortOrder } from '../interfaces/games'
import type { GameListData } from '../types/games'

const ITEMS_PER_PAGE = 40

export function UserGamesPageByStatus() {
  const { status } = useParams<{ status: string }>()
  const navigate = useNavigate()

  const enumToRouteMap: Record<GameStatusEnum, string> = {
    [GameStatusEnum.Played]: 'playedGames',
    [GameStatusEnum.Playing]: 'playingGames',
    [GameStatusEnum.Paused]: 'pausedGames',
    [GameStatusEnum.Backlog]: 'backlogGames',
    [GameStatusEnum.Wishlist]: 'wishlistGames',
    [GameStatusEnum.Dropped]: 'droppedGames'
  }

  const routeToEnumMap: Record<string, GameStatusEnum> = {
    playedGames: GameStatusEnum.Played,
    playingGames: GameStatusEnum.Playing,
    pausedGames: GameStatusEnum.Paused,
    backlogGames: GameStatusEnum.Backlog,
    wishlistGames: GameStatusEnum.Wishlist,
    droppedGames: GameStatusEnum.Dropped
  }

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    return parsePage(url.searchParams.get('page'))
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
    if (
      v === 'releaseDate' ||
      v === 'rating' ||
      v === 'name' ||
      v === 'hoursPlayed' ||
      v === 'completedAt'
    ) {
      return v
    }
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

  const isInvalidStatus = !status || !(status in routeToEnumMap)

  useEffect(() => {
    if (isInvalidStatus) {
      toast.info('Essa seção da biblioteca não existe. Mostrando toda a sua biblioteca.', {
        toastId: 'invalid-library-status'
      })
    }
  }, [isInvalidStatus])

  if (isInvalidStatus) {
    return <Navigate to="/userLibrary" replace />
  }

  return (
    <>
      <BackButton className="mt-4" />
      <h1 className="sr-only">Minha biblioteca</h1>
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
          defaultSort={
            currentEnumStatus === GameStatusEnum.Played
              ? { field: 'completedAt', order: 'desc' }
              : { field: 'name', order: 'asc' }
          }
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
