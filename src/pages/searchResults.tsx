import { Link, useParams } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button } from '../components/button'
import { EmptyState } from '../components/emptyState'

export function SearchResults() {
  const { query } = useParams()

  const {
    GamesResponseInfinity,
    fetchNextPage,
    hasNextPage,
    isLoadingInfinite,
    isErrorInfinite
  } = useGames(1, query, 'name', 'asc', 10)

  if (isLoadingInfinite) {
    return (
      <div className="flex flex-col gap-4 mt-4 animate-pulse">
        <div className="h-6 bg-dark-bg-light rounded w-48" />
        {Array.from({ length: 5 }, (_, i) => `sk${i}`).map(k => (
          <div key={k} className="flex gap-4 p-4">
            <div className="w-32 h-40 rounded-lg bg-dark-bg-light flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-3 py-1">
              <div className="h-5 bg-dark-bg-light rounded w-3/4" />
              <div className="h-4 bg-dark-bg-light rounded w-1/3" />
              <div className="h-3 bg-dark-bg-light rounded w-full" />
              <div className="h-3 bg-dark-bg-light rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isErrorInfinite) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erro ao carregar jogos</p>
          <Button variant="secondary" size="md">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const resultForSearchGames =
    GamesResponseInfinity?.pages.flatMap(page => page.games) ?? []
  const total = GamesResponseInfinity?.pages[0].total ?? 0

  if (resultForSearchGames.length === 0) {
    return (
      <EmptyState
        title="Nenhum jogo encontrado"
        description={
          query ? (
            <span>
              Não encontramos resultados para{' '}
              <span className="text-primary font-medium">"{query}"</span>. Tente
              termos diferentes ou verifique a ortografia.
            </span>
          ) : (
            'Não há jogos disponíveis no momento.'
          )
        }
      />
    )
  }

  return (
    <>
      <div className="w-full mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1 text-center sm:text-left">
          <p className="text-primary text-base sm:text-lg">
            {total} {total === 1 ? 'resultado' : 'resultados'} para
          </p>
          <p className="text-white text-lg sm:text-xl font-bold break-words">
            {query}
          </p>
        </div>
      </div>

      <InfiniteScroll
        dataLength={resultForSearchGames.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              <p className="text-gray-400">Carregando mais jogos...</p>
            </div>
          </div>
        }
      >
        {resultForSearchGames.map(game => (
          <div key={game.igdbId} className="group">
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg hover:bg-dark-bg-lighter transition-colors duration-200">
              <Link
                to={`/games/${game.igdbId}`}
                className="w-full sm:w-auto flex-shrink-0"
              >
                {game.coverUrl ? (
                  <img
                    className="w-full h-48 sm:w-32 sm:h-40 md:w-36 md:h-48 lg:w-40 lg:h-52 xl:w-44 xl:h-56 rounded-lg object-cover"
                    src={game.coverUrl}
                    alt={`${game.name} banner`}
                  />
                ) : (
                  <div className="w-full h-48 sm:w-32 sm:h-40 rounded-lg bg-dark-bg-lighter flex items-center justify-center">
                    <span className="text-gray-600 text-xs">Sem capa</span>
                  </div>
                )}
              </Link>

              <div className="flex-1 w-full sm:w-auto min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <Link to={`/games/${game.igdbId}`}>
                    <h3 className="text-white font-semibold text-lg sm:text-xl group-hover:text-primary transition-colors duration-200 truncate">
                      {game.name}
                    </h3>
                  </Link>
                  {game.releaseDate && (
                    <span className="text-sm text-gray-400 bg-gray-800 rounded-md px-2 py-1 self-start sm:self-center flex-shrink-0">
                      {dayjs.unix(game.releaseDate).format('YYYY')}
                    </span>
                  )}
                </div>

                {game.platforms && game.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="break-words">
                        {game.platforms.join(', ')}
                      </span>
                    </span>
                  </div>
                )}

                {game.summary && (
                  <p className="text-gray-300 text-sm line-clamp-2 sm:line-clamp-3 break-words">
                    {game.summary}
                  </p>
                )}
              </div>
            </div>

            <div className="border-b border-dark-border mt-4 mb-4" />
          </div>
        ))}
      </InfiniteScroll>
    </>
  )
}
