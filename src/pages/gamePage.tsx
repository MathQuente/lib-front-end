import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import { Link, useParams } from 'react-router-dom'
import { SideBar } from '../components/sideBar'
import type { GameResponse, SimilarGamesResponse } from '../types/games'
import { GameFormStatus } from '../components/gameFormStatus'
import { PlatformDiv } from '../components/platformDiv'
import { GameLaunchersDiv } from '../components/gameLaunchersDiv'
import { CategoriesDiv } from '../components/categoriesDiv'

export function GamePage() {
  const api = useApi()
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

  console.log(GameResponse)

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
              {GameResponse?.gameAndDlc?.name}
            </p>
            <img
              className="w-80 rounded-lg"
              src={GameResponse?.gameAndDlc?.banner}
              alt=""
            />
          </div>
          <GameFormStatus item={GameResponse.gameAndDlc} />
          <div className="flex flex-row gap-2">
            {GameResponse.gameAndDlc.platforms.map(platform => (
              <PlatformDiv
                key={platform.id}
                platformName={platform.platformName}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GameResponse.gameAndDlc.gameLaunchers.map(gameLaunchers => (
              <GameLaunchersDiv
                key={gameLaunchers.platforms.id}
                gameLaucher={gameLaunchers}
              />
            ))}
          </div>
          <div className="flex flex-col flex-wrap items-center justify-center gap-2">
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold text-slate-200">
                Developer:
              </h2>
              {GameResponse.gameAndDlc.gameStudios.map(
                (gameStudio, index, array) => (
                  <div key={gameStudio.id}>
                    <p className="text-xl font-bold text-slate-400">
                      {gameStudio.studioName}
                      {index < array.length - 1 && (
                        <span className="text-xl text-white">, </span>
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold  text-slate-200">
                Publisher:
              </h2>
              {GameResponse.gameAndDlc.publishers.map(
                (publisher, index, array) => (
                  <div key={publisher.id}>
                    <p className="text-xl font-bold text-slate-400">
                      {publisher.publisherName}
                      {index < array.length - 1 && (
                        <span className="text-xl text-white">, </span>
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col items-center w-11/12">
            <h2 className="font-bold text-xl text-white">Summary</h2>
            <div className="flex flex-col">
              <p className="text-gray-400 text-lg">
                {GameResponse.gameAndDlc.summary}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {GameResponse.gameAndDlc.categories.map(category => (
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
              {GameResponse.gameAndDlc.gameStudios.map(
                (gameStudio, index, array) => (
                  <div key={gameStudio.id}>
                    <p className="text-xl font-bold text-slate-400">
                      {gameStudio.studioName}
                      {index < array.length - 1 && (
                        <span className="text-xl">, </span>
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-row gap-2">
              <h2 className="text-xl font-semibold  text-slate-200">
                Publisher:
              </h2>
              {GameResponse.gameAndDlc.publishers.map(
                (publisher, index, array) => (
                  <div key={publisher.id}>
                    <p className="text-xl font-bold text-slate-400">
                      {publisher.publisherName}
                      {index < array.length - 1 && (
                        <span className="text-xl">, </span>
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {GameResponse.gameAndDlc.type === 'dlc' ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-white">
                Original Game
              </h2>
              <Link to={`/games/${GameResponse.gameAndDlc.game?.id}`}>
                <img
                  className="w-52 h-64 rounded-lg"
                  src={GameResponse.gameAndDlc.game?.banner}
                  alt=""
                />
              </Link>
            </div>
          ) : GameResponse.gameAndDlc.type === 'game' ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-white">DLCS</h2>
              <div className="flex gap-2">
                {GameResponse.gameAndDlc.dlcs?.map(dlc => (
                  <div key={dlc.id}>
                    <Link to={`/games/${dlc.id}`}>
                      <img
                        className="w-52 h-64 rounded-lg"
                        src={dlc.banner}
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
                      className="w-44 rounded-lg"
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
