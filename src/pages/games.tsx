import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { GameListPage } from '../components/gameListPage'
import { useGames } from '../hooks/useGames'
import type { SortField, SortOrder } from '../interfaces/games'

export function Games() {
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
    return v === 'releaseDate'
      ? 'releaseDate'
      : v === 'rating'
        ? 'rating'
        : 'name'
  })

  const LIMIT = 36
  const { GamesResponse } = useGames(page, '', sortField, sortOrder, LIMIT)

  if (!GamesResponse) {
    return (
      <div className="flex flex-col gap-4 w-full mt-4 animate-pulse">
        <div className="h-8 bg-dark-bg-light rounded-lg w-48" />
        <div className="bg-dark-bg-light border border-dark-border rounded-lg py-4 px-4">
          <div className="grid grid-cols-5 md:grid-cols-6 p-2 gap-x-2 gap-y-4">
            {Array.from({ length: 18 }, (_, i) => `sk${i}`).map(k => (
              <div
                key={k}
                className="aspect-[7/10] w-full rounded-lg bg-dark-bg-lighter"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <GameListPage
        games={GamesResponse}
        page={page}
        pageSize={LIMIT}
        setPage={setPage}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortField={sortField}
        setSortField={setSortField}
      />

      <ToastContainer />
    </>
  )
}
