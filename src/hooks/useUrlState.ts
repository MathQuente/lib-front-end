// hooks/useUrlState.ts
import { useState, useCallback } from 'react'

interface UseUrlStateReturn {
  search: string
  page: number
  setCurrentPage: (page: number) => void
  setCurrentSearch: (search: string) => void
  scrollToTop?: () => void
}

export function useUrlState(
  topRef?: React.RefObject<HTMLDivElement>
): UseUrlStateReturn {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())
    return url.searchParams.get('search') ?? ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())
    const pageParam = url.searchParams.get('page')
    return pageParam ? Number(pageParam) : 1
  })

  const scrollToTop = useCallback(() => {
    topRef?.current?.scrollIntoView({ behavior: 'instant' })
  }, [topRef])

  const setCurrentPage = useCallback(
    (newPage: number) => {
      const url = new URL(window.location.toString())
      url.searchParams.set('page', String(newPage))
      window.history.pushState({}, '', url)
      setPage(newPage)
      scrollToTop()
    },
    [scrollToTop]
  )

  const setCurrentSearch = useCallback((newSearch: string) => {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', newSearch)
    window.history.pushState({}, '', url)
    setSearch(newSearch)
  }, [])

  return {
    search,
    page,
    setCurrentPage,
    setCurrentSearch,
    scrollToTop
  }
}
