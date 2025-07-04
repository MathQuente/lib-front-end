import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import { Link, useParams } from 'react-router-dom'
import { SideBar } from '../components/sideBar'
import type { GameResponse, SimilarGamesResponse } from '../types/games'
import { GameForm } from '../components/gamesComponents/gameForm'
import { PlatformDiv } from '../components/platformDiv'
import { GameLaunchersDiv } from '../components/gameLaunchersDiv'
import { CategoriesDiv } from '../components/categoriesDiv'
import { useAuth } from '../hooks/useAuth'

export function GamePage() {
  const api = useApi()
  const { user } = useAuth()

  const { gameId } = useParams()

  const { data: GameResponse } = useQuery<GameResponse>({
    queryKey: ['game', gameId],
    queryFn: async () => api.getGame(gameId),
  })

  const { data: SimilarGames } = useQuery<SimilarGamesResponse>({
    queryKey: ['similarGames'],
    queryFn: async () => api.getSimilarGames(gameId),
    placeholderData: keepPreviousData,
  })

  if (!GameResponse) {
    return null
  }

  if (!SimilarGames) {
    return null
  }

  return (
    <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26]">
      <SideBar />

      <div className=" flex flex-col items-center ml-28">
        <div className="flex flex-col items-center gap-4 w-full pt-2 pb-4">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-white">
              {GameResponse?.game?.gameName}
            </p>
            <img
              className="w-80 rounded-lg"
              src={GameResponse?.game?.gameBanner}
              alt=""
            />
          </div>
          {user && <GameForm game={GameResponse.game} />}
          <div className="flex flex-row gap-2">
            {GameResponse.game.platforms.map(platform => (
              <PlatformDiv
                key={platform.id}
                platformName={platform.platformName}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GameResponse.game.gameLaunchers.map(gameLaunchers => (
              <GameLaunchersDiv
                key={gameLaunchers.platform.id}
                gameLaucher={gameLaunchers}
              />
            ))}
          </div>
          <div className="flex flex-col flex-wrap items-center justify-center gap-2">
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold text-slate-200">
                Developer:
              </h2>
              {GameResponse.game.gameStudios.map((gameStudio, index, array) => (
                <div key={gameStudio.id}>
                  <p className="text-xl font-bold text-slate-400">
                    {gameStudio.studioName}
                    {index < array.length - 1 && (
                      <span className="text-xl text-white">, </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold  text-slate-200">
                Publisher:
              </h2>
              {GameResponse.game.publishers.map((publisher, index, array) => (
                <div key={publisher.id}>
                  <p className="text-xl font-bold text-slate-400">
                    {publisher.publisherName}
                    {index < array.length - 1 && (
                      <span className="text-xl text-white">, </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center w-11/12">
            <h2 className="font-bold text-xl text-white">Summary</h2>
            <div className="flex flex-col">
              <p className="text-gray-400 text-lg">
                {GameResponse.game.summary}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {GameResponse.game.categories.map(category => (
              <CategoriesDiv
                categoryName={category.categoryName}
                key={category.id}
              />
            ))}
          </div>
          <div className="flex flex-col flex-wrap items-center justify-center gap-2">
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold text-slate-200">
                Developer:
              </h2>
              {GameResponse.game.gameStudios.map((gameStudio, index, array) => (
                <div key={gameStudio.id}>
                  <p className="text-xl font-bold text-slate-400">
                    {gameStudio.studioName}
                    {index < array.length - 1 && (
                      <span className="text-xl">, </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold  text-slate-200">
                Publisher:
              </h2>
              {GameResponse.game.publishers.map((publisher, index, array) => (
                <div key={publisher.id}>
                  <p className="text-xl font-bold text-slate-400">
                    {publisher.publisherName}
                    {index < array.length - 1 && (
                      <span className="text-xl">, </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {GameResponse.game.isDlc ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-white">
                Original Game
              </h2>
              <Link to={`/games/${GameResponse.game.id}`}>
                <img
                  className="w-52 h-64 rounded-lg"
                  src={GameResponse.game?.parentGame?.gameBanner}
                  alt=""
                />
              </Link>
            </div>
          ) : !GameResponse.game.isDlc ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-white">DLCS</h2>
              <div className="flex gap-2">
                {GameResponse.game.dlcs?.map(dlc => (
                  <div key={dlc.id}>
                    <Link to={`/games/${dlc.id}`}>
                      <img
                        className="w-32 h-16 sm:w-36 md:w-44 md:h-56 sm:h-40 lg:min-w-28 lg:h-44 xl:w-48 xl:h-52 2xl:w-48 2xl:min-h-64 rounded-lg"
                        src={dlc.gameBanner}
                        alt=""
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-semibold text-white">No DLC yet</h1>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-bold text-xl text-white">Similar games</h2>
            <div className="flex justify-center gap-2">
              {SimilarGames.similarGames.map(gameAndDlc => (
                <div key={gameAndDlc.id}>
                  <Link to={`/games/${gameAndDlc.id}`}>
                    <img
                      className="w-32 h-16 sm:w-36 md:w-44 md:h-56 sm:h-40 lg:min-w-28 lg:h-44 xl:w-48 xl:h-52 2xl:w-48 2xl:min-h-64 rounded-lg"
                      src={gameAndDlc.gameBanner || gameAndDlc.dlcBanner}
                      alt=""
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
