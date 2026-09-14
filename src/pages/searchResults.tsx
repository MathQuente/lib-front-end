import { Link, useParams } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button } from '../components/button'
import { EmptyState } from '../components/emptyState'
import { GameCard } from '../components/gamesComponents/gameCard'
import { BackButton } from '../components/backButton'

export function SearchResults() {
  const { query } = useParams()

  const {
    GamesResponseInfinity,
    fetchNextPage,
    hasNextPage,
    isLoadingInfinite,
    isErrorInfinite,
    refetchInfinite
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
          <Button
            variant="secondary"
            size="md"
            onClick={() => refetchInfinite()}
          >
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
      <BackButton className="mt-4 mb-2" />
      <div className="w-full mb-4">
        <h1 className="flex flex-col sm:flex-row sm:items-center justify-center gap-1 text-center sm:text-left">
          <span className="text-primary text-base sm:text-lg font-normal">
            {total} {total === 1 ? 'resultado' : 'resultados'} para
          </span>
          <span className="text-white text-lg sm:text-xl font-bold break-words">
            {query}
          </span>
        </h1>
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
          <div key={game.igdbId}>
            <Link
              to={`/games/${game.igdbId}`}
              className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg hover:bg-dark-bg-lighter transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
            >
              <div className="w-full sm:w-auto flex-shrink-0">
                <GameCard game={game} size="larger" interactive={false} />
              </div>

              <div className="flex-1 w-full sm:w-auto min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-white font-semibold text-lg sm:text-xl group-hover:text-primary transition-colors duration-200 truncate">
                    {game.name}
                  </h2>
                  {game.releaseDate && (
                    <span className="text-sm text-gray-300 bg-dark-bg-lighter border border-dark-border rounded-full px-2.5 py-1 self-start sm:self-center flex-shrink-0">
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
            </Link>

            <div className="border-b border-dark-border mt-4 mb-4" />
          </div>
        ))}
      </InfiniteScroll>
    </>
  )
}
