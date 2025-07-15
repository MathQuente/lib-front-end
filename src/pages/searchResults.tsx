import { Link, useParams } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import dayjs from 'dayjs'
import { SideBar } from '../components/sideBar'
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
  } = useGames(1, query, 'gameName', 'asc')

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
      <SideBar />
      <div className="min-h-screen bg-[#1A1C26]">
        <div className="max-w-4xl mx-auto">
          <span className="pt-4 mb-8 flex justify-center items-center gap-1">
            <p className="text-[#7A38CA] text-lg">{total} results for</p>
            <p className="text-[#FFFFFF] text-xl font-bold">{query}</p>
          </span>
        </div>

        <div className="mx-[365px] space-y-6">
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
                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg hover:bg-[#2a2b35]  transition-colors duration-200">
                  <Link to={`/games/${game.id}`}>
                    <img
                      className='w-32 h-16 sm:w-36 md:w-44 md:h-56 sm:h-40 lg:min-w-28 lg:h-44 xl:w-48 xl:h-52 2xl:w-32 2xl:h-40 rounded-lg"'
                      src={game.gameBanner}
                      alt={`${game.gameName} banner`}
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <Link to={`/games/${game.id}`}>
                        <h3 className="text-white font-semibold text-xl group-hover:text-[#7A38CA] transition-colors duration-200 truncate">
                          {game.gameName}
                        </h3>
                      </Link>
                      <span className="text-sm text-gray-400 bg-gray-800 rounded-md px-2 py-1 flex-shrink-0">
                        {dayjs(game.gameLaunchers[0].dateRelease).format(
                          'YYYY'
                        )}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-400">
                      {game.platforms && game.platforms.length > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[#7A38CA] rounded-full" />
                          {game.platforms
                            .map(platform => platform.platformName)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                    {game.summary && (
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                        {game.summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-700 mt-4 mb-4" />
              </div>
            ))}
          </InfiniteScroll>
        </div>

        {resultForSeachGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No games found for "{query}"
            </p>
          </div>
        )}
      </div>
    </>
  )
}
