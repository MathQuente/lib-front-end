import { Link, useParams } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button } from '../components/button'

export function SearchResults() {
  const { query } = useParams()

  const {
    GamesResponseInfinity,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingInfinite,
    isErrorInfinite
  } = useGames(1, query, 'gameName', 'asc', 10)

  if (!GamesResponseInfinity) {
    return null
  }

  if (isLoadingInfinite) {
    return (
      <div className="min-h-screen bg-[#1A1C26] flex items-center justify-center">
        <p className="text-white">Loading games...</p>
      </div>
    )
  }

  if (isErrorInfinite) {
    return (
      <div className="min-h-screen bg-[#1A1C26] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error at load games</p>
          <Button variant="secondary" size="md">
            Try again
          </Button>
        </div>
      </div>
    )
  }

  const resultForSeachGames = GamesResponseInfinity.pages.flatMap(
    page => page.games
  )
  const total = GamesResponseInfinity.pages[0].total || 0

  return (
    <>
      <div className="w-full mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1 text-center sm:text-left">
          <p className="text-[#7A38CA] text-base sm:text-lg">
            {total} results for
          </p>
          <p className="text-[#FFFFFF] text-lg sm:text-xl font-bold break-words">
            {query}
          </p>
        </div>
      </div>

      <InfiniteScroll
        dataLength={resultForSeachGames.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex justify-center py-4">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#7A38CA] border-t-transparent" />
                <p className="text-gray-400">Loading more games...</p>
              </div>
            ) : (
              <p className="text-gray-400">Loading...</p>
            )}
          </div>
        }
      >
        {resultForSeachGames.map(game => (
          <div key={game.id} className="group">
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg hover:bg-[#2a2b35] transition-colors duration-200">
              <Link
                to={`/games/${game.id}`}
                className="w-full sm:w-auto flex-shrink-0"
              >
                <img
                  className="w-full h-48 sm:w-32 sm:h-40 md:w-36 md:h-48 lg:w-40 lg:h-52 xl:w-44 xl:h-56 rounded-lg object-cover"
                  src={game.gameBanner}
                  alt={`${game.gameName} banner`}
                />
              </Link>

              <div className="flex-1 w-full sm:w-auto min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <Link to={`/games/${game.id}`} className="">
                    <h3 className="text-white font-semibold text-lg sm:text-xl group-hover:text-[#7A38CA] transition-colors duration-200 truncate">
                      {game.gameName}
                    </h3>
                  </Link>
                  <span className="text-sm text-gray-400 bg-gray-800 rounded-md px-2 py-1 self-start sm:self-center flex-shrink-0">
                    {dayjs(game.gameLaunchers[0].dateRelease).format('YYYY')}
                  </span>
                </div>

                {game.platforms && game.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#7A38CA] rounded-full flex-shrink-0" />
                      <span className="break-words">
                        {game.platforms
                          .map(platform => platform.platformName)
                          .join(', ')}
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

            <div className="border-b border-gray-700 mt-4 mb-4" />
          </div>
        ))}
      </InfiniteScroll>

      {resultForSeachGames.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-white">
              Nenhum jogo encontrado
            </h3>
            {query ? (
              <p className="text-[#8F8F8F] max-w-md">
                Não encontramos jogos que correspondam à sua busca por{' '}
                <span className="text-[#6930CD] font-medium">"{query}"</span>.
                Tente usar termos diferentes ou verifique a ortografia.
              </p>
            ) : (
              <p className="text-[#8F8F8F] max-w-md">
                Não há jogos disponíveis no momento. Tente novamente mais tarde.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
