import { Link, useParams } from 'react-router-dom'
import { SideBar } from '../components/sideBar'
import { GameForm } from '../components/gamesComponents/gameForm'
import { PlatformDiv } from '../components/platformDiv'
import { GameLaunchersDiv } from '../components/gameLaunchersDiv'
import { useAuth } from '../hooks/useAuth'

import { RatingChart } from '../components/ratingChart'
import { Details } from '../components/details'
import { PlayersInfo } from '../components/playersInfo'
import { useGame } from '../hooks/useGame'
import { SimilarGamesSlider } from '../components/similarGamesSlider'
import { DlcAndOriginalGameArea } from '../components/dlcAndOriginalGameArea'
import { RatingAverage } from '../components/ratingAverage'

export function GamePage() {
  const { user } = useAuth()
  const { gameId } = useParams<{ gameId: string }>()
  const { GameResponse, SimilarGames } = useGame(gameId)

  if (!GameResponse) {
    return null
  }

  if (!SimilarGames) {
    return null
  }

  return (
    <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26]">
      <SideBar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20">
          <div className="lg:col-span-1">
            <div className="bg-[#272932]/50 backdrop-blur-sm rounded-2xl p-10 border-gray-700-50 top-8 lg:w-[400px]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-bold text-white">
                  {GameResponse?.game?.gameName}
                </p>
                <img
                  className="w-72 rounded-lg"
                  src={GameResponse?.game?.gameBanner}
                  alt=""
                />
              </div>
              {user ? (
                <div className="w-full flex flex-col items-center justify-center mt-4">
                  <RatingAverage game={GameResponse.game} isForGamePage />
                  <GameForm game={GameResponse.game} />
                </div>
              ) : (
                <div className="flex items-center justify-center mt-4 gap-1">
                  <Link
                    to={'/auth'}
                    className="text-base font-bold text-[#7A38CA]"
                  >
                    Log in
                  </Link>
                  <p className="text-base font-bold text-white">
                    for access to rating features
                  </p>
                </div>
              )}
              <div className="flex flex-col items-center mt-4">
                <p className="text-gray-400">Avg Rating </p>

                <RatingAverage game={GameResponse.game} justAverage />
              </div>

              <RatingChart GameResponse={GameResponse} />

              <PlayersInfo GameResponse={GameResponse} />

              <div className="mb-6 mt-2">
                <h3 className="text-lg mb-3 font-semibold text-gray-200">
                  Platforms
                </h3>
                <div className="flex flex-row flex-wrap gap-x-1 gap-y-1.5">
                  {GameResponse.game.platforms.map(platform => {
                    return (
                      <PlatformDiv
                        platformName={platform.platformName}
                        key={platform.id}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-lg mb-3 font-semibold text-gray-200">
                  Date release
                </h3>
                <div className="flex flex-row flex-wrap gap-x-1 gap-y-1.5">
                  {GameResponse.game.gameLaunchers.map(launcher => (
                    <GameLaunchersDiv
                      key={launcher.platform.id}
                      gameLaucher={launcher}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <div className="space-y-6 ">
              <div className="bg-[#272932]/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">
                  About the game
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {GameResponse.game.summary}
                </p>
              </div>

              <Details GameResponse={GameResponse} />

              <DlcAndOriginalGameArea gameResponse={GameResponse} />

              <SimilarGamesSlider SimilarGames={SimilarGames} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
