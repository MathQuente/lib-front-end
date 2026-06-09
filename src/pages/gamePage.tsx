import { Link, useParams } from 'react-router-dom'
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

  if (!GameResponse || !SimilarGames) return null

  const { game } = GameResponse

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 w-full">
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6 bg-[#1F2029] border border-[#2A2B36] rounded-lg p-5 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <img
              className="w-56 rounded-lg object-cover"
              src={game.gameBanner}
              alt={`${game.gameName} banner`}
            />
            <h1 className="text-white font-semibold text-center">
              {game.gameName}
            </h1>
          </div>

          {user ? (
            <div className="flex flex-col gap-4 items-center">
              <GameForm game={game} />

              <div className="w-full border-t border-[#2A2B36] pt-4 flex flex-col gap-1">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                  Sua avaliação
                </p>
                <RatingAverage game={game} isForGamePage />
              </div>
            </div>
          ) : (
            <p className="text-sm text-center text-gray-500">
              <Link
                to="/auth?tab=login"
                className="text-[#7A38CA] hover:underline"
              >
                Faça login
              </Link>{' '}
              para avaliar e adicionar à sua biblioteca.
            </p>
          )}

          <div className="border-t border-[#2A2B36] pt-4 flex flex-col gap-1">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
              Média geral
            </p>
            <RatingAverage game={game} justAverage />
            <RatingChart GameResponse={GameResponse} />
          </div>

          <PlayersInfo GameResponse={GameResponse} />

          {game.platforms.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">
                Plataformas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {game.platforms.map(platform => (
                  <PlatformDiv
                    key={platform.id}
                    platformName={platform.platformName}
                  />
                ))}
              </div>
            </div>
          )}

          {game.gameLaunchers.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">
                Lançamento
              </p>
              <div className="flex flex-wrap gap-1.5">
                {game.gameLaunchers.map(launcher => (
                  <GameLaunchersDiv
                    key={launcher.platform.id}
                    gameLaucher={launcher}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-[#1F2029] border border-[#2A2B36] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-[#7A38CA] pl-3 uppercase tracking-wide mb-4">
            Sobre o jogo
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            {game.summary}
          </p>
        </div>

        <Details GameResponse={GameResponse} />

        <DlcAndOriginalGameArea gameResponse={GameResponse} />

        <SimilarGamesSlider SimilarGames={SimilarGames} />
      </div>
    </div>
  )
}
