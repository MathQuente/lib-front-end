import { SideBar } from '../components/sideBar'

import { ToastContainer } from 'react-toastify'
import { GameListPage } from '../components/gameListPage'
import { useState } from 'react'
import { useGames } from '../hooks/useGames'

type SortField = 'gameName' | 'dateRelease'
type SortOrder = 'asc' | 'desc'

export function ComingSoonPage() {
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

  const { ComingSoon } = useGames(page, search, sortField, sortOrder)

  if (!ComingSoon) {
    return null
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#1A1C26]">
        <div className="flex-1 flex flex-col md:ml-0">
          <SideBar />

          <GameListPage
            games={ComingSoon}
            page={page}
            setPage={setPage}
            search={search}
            setSearch={setSearch}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortField={sortField}
            setSortField={setSortField}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
