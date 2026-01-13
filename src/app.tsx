import { Link } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'

import userLibrary from './assets/Screenshot From 2025-07-03 18-09-08.png'
import { Button } from './components/button'
import { GameListSection } from './components/gameListSection'
import { GameCard } from './components/gamesComponents/gameCard'
import { useUserGames } from './hooks/useUserGames'
import { useGames } from './hooks/useGames'

export function App() {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const isLogged = !!userId

  const { UserGamesResponse, GamesToDisplay } = useUserGames()
  const { GamesResponse, gamesFeatured } = useGames(1, '', 'gameName', 'asc')

  if (!gamesFeatured) return null

  if (!GamesResponse) return null

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        {isLogged ? (
          <>
            <div className="flex flex-col items-center gap-8 mt-8 w-full">
              <div className="flex items-center gap-2 text-center">
                <p className="text-gray-400 text-2xl">Welcome to</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#7A38CA] to-[#9D52E8] bg-clip-text text-transparent">
                  Lib,
                </p>
                <p className="text-2xl font-semibold text-white">
                  {user?.userName}
                </p>
              </div>

              <div className="flex flex-col items-center mt-4 p-8 bg-gradient-to-r from-[#1F2029] to-[#25262F] rounded-2xl border border-[#2A2B36] shadow-2xl">
                {GamesToDisplay?.game ? (
                  <>
                    <p className="text-gray-300 mb-6 text-lg font-medium text-center lg:block">
                      {GamesToDisplay?.message}
                    </p>
                    <Link
                      to={`/games/${GamesToDisplay.game.id}`}
                      className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-[#7A38CA]/20"
                    >
                      <GameCard game={GamesToDisplay.game} size="medium" />
                    </Link>
                  </>
                ) : (
                  <div className="text-gray-400 text-center p-8">
                    Nenhum jogo encontrado
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center w-full max-w-2xl">
                <h3 className="text-2xl text-white font-semibold mb-4">
                  Profile Stats
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#1F2029] to-[#181920] rounded-xl border border-[#2A2B36]">
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                      Played
                    </p>
                    <p className="text-white text-3xl font-bold">
                      {UserGamesResponse?.games.PLAYED
                        ? UserGamesResponse?.games.PLAYED.length
                        : 0}
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#1F2029] to-[#181920] rounded-xl border border-[#2A2B36] ">
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                      Playing
                    </p>
                    <p className="text-white text-3xl font-bold">
                      {UserGamesResponse?.games.PLAYING
                        ? UserGamesResponse?.games.PLAYING.length
                        : 0}
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#1F2029] to-[#181920] rounded-xl border border-[#2A2B36] ">
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                      Backlog
                    </p>
                    <p className="text-white text-3xl font-bold">
                      {UserGamesResponse?.games.BACKLOG
                        ? UserGamesResponse?.games.BACKLOG.length
                        : 0}
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#1F2029] to-[#181920] rounded-xl border border-[#2A2B36] ">
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                      Wishlist
                    </p>
                    <p className="text-white text-3xl font-bold">
                      {UserGamesResponse?.games.WISHLIST
                        ? UserGamesResponse?.games.WISHLIST.length
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-between w-full mx-auto py-12">
            <div className="flex flex-col items-center gap-8 pt-8 text-center">
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  <span className="text-white">Welcome to </span>
                  <span className="bg-gradient-to-r from-[#7A38CA] to-[#9D52E8] bg-clip-text text-transparent">
                    Lib
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
                  Track your gaming journey and discover amazing new games
                </p>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#1F2029] to-[#25262F] rounded-2xl border border-[#2A2B36]">
                <p className="text-lg text-gray-300">Don't have an account?</p>
                <Link to="/auth">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-gradient-to-r from-[#7A38CA] to-[#9D52E8] hover:from-[#8B47DB] hover:to-[#AE63F9] text-white border-0 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#7A38CA]/25"
                  >
                    Sign up now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center w-full gap-8 mt-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  A little about the{' '}
                  <span className="text-[#7A38CA]">Lib project</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                  Lib is a web application to track your games and discover
                  others. It's a project that I started to learn and improve my
                  programming skills. My idea was to work on something I'm
                  passionate about, making the development process more
                  enjoyable. It's under progressive development and I hope you
                  enjoy!
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
                <div className="flex-shrink-0">
                  <img
                    className="w-full max-w-[500px] h-[300px] lg:h-[350px] object-cover border border-gray-600 rounded-2xl shadow-2xl hover:shadow-[#7A38CA]/10 transition-all duration-300"
                    src={userLibrary}
                    alt="User Library Screenshot"
                  />
                </div>

                <div className="space-y-6 lg:max-w-lg">
                  <h3 className="text-3xl lg:text-4xl font-bold text-white">
                    Track <span className="text-[#7A38CA]">every game</span>
                  </h3>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    You can log any game you've played, are currently playing,
                    or wish to play.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center pb-8 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#7A38CA] to-[#9D52E8] bg-clip-text text-transparent">
              Recent Releases
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Discover the latest games that just hit the market
          </p>
        </div>

        <div className="w-full flex gap-8 xl:max-w-6xl lg:max-w-4xl md:max-w-2xl">
          {gamesFeatured.recentGames.length > 0 ? (
            gamesFeatured.recentGames.map(game => (
              <Link
                to={`/games/${game.id}`}
                className="block transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-[#7A38CA]/20"
                key={game.id}
              >
                <GameCard game={game} size="larger" />
              </Link>
            ))
          ) : (
            <div className="w-full px-8 py-12 rounded-2xl bg-gradient-to-r from-[#1F2029] to-[#25262F] border border-[#2A2B36] flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-white mb-3">
                No games found
              </h3>
              <p className="text-gray-400 text-lg">
                There are no games available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-start gap-8 mb-12">
        <GameListSection
          type="coming"
          games={gamesFeatured.futureGames}
          title="Coming Soon"
        />

        <GameListSection
          type="trending"
          games={gamesFeatured.trendingGames}
          title="Trending Games"
        />

        <GameListSection
          type="rateds"
          games={gamesFeatured.mostRatedGames}
          title="Most Rated"
        />
      </div>
    </>
  )
}
