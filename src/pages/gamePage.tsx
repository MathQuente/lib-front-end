import { Link, useParams } from 'react-router-dom'
import { GameForm } from '../components/gamesComponents/gameForm'
import { PlatformDiv } from '../components/platformDiv'
import { useAuth } from '../hooks/useAuth'
import { RatingChart } from '../components/ratingChart'
import { Details } from '../components/details'
import { PlayersInfo } from '../components/playersInfo'
import { useGame } from '../hooks/useGame'
import { SimilarGamesSlider } from '../components/similarGamesSlider'
import { RelatedGamesSlider } from '../components/relatedGamesSlider'
import { RatingAverage } from '../components/ratingAverage'
import dayjs from 'dayjs'

export function GamePage() {
  const { user } = useAuth()
  const { igdbId } = useParams<{ igdbId: string }>()
  const { GameResponse, SimilarGames } = useGame(igdbId)

  if (!GameResponse || !SimilarGames) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 w-full animate-pulse">
        <div className="lg:col-span-1">
          <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3">
              <div className="w-56 h-80 rounded-lg bg-dark-bg-lighter" />
              <div className="h-5 w-40 rounded bg-dark-bg-lighter" />
            </div>
            <div className="flex justify-center gap-4">
              {Array.from({ length: 3 }, (_, i) => `sk${i}`).map(k => (
                <div key={k} className="flex flex-col items-center gap-1">
                  <div className="size-7 rounded bg-dark-bg-lighter" />
                  <div className="h-3 w-10 rounded bg-dark-bg-lighter" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5 h-36" />
          <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5 h-24" />
        </div>
      </div>
    )
  }

  const { game, relatedGames } = GameResponse

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 w-full">
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6 bg-dark-bg-light border border-dark-border rounded-lg p-5 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            {game.coverUrl ? (
              <img
                className="w-56 rounded-lg object-cover"
                src={game.coverUrl}
                alt={`${game.name} banner`}
              />
            ) : (
              <div className="w-56 h-80 rounded-lg bg-dark-bg-lighter flex items-center justify-center">
                <span className="text-gray-600 text-sm">Sem capa</span>
              </div>
            )}
            <h1 className="text-white font-semibold text-center">
              {game.name}
            </h1>
          </div>

          {user ? (
            <div className="flex flex-col gap-4 items-center">
              <GameForm game={game} />

              <div className="w-full border-t border-dark-border pt-4 flex flex-col gap-1">
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
                className="text-primary hover:underline"
              >
                Faça login
              </Link>{' '}
              para avaliar e adicionar à sua biblioteca.
            </p>
          )}

          <div className="border-t border-dark-border pt-4 flex flex-col gap-1">
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
                  <PlatformDiv key={platform} platformName={platform} />
                ))}
              </div>
            </div>
          )}

          {game.releaseDate && (
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">
                Lançamento
              </p>
              <span className="inline-flex items-center px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm text-gray-300">
                {dayjs.unix(game.releaseDate).format('DD/MM/YYYY')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-4">
        {game.summary && (
          <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-primary pl-3 uppercase tracking-wide mb-4">
              Sobre o jogo
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              {game.summary}
            </p>
          </div>
        )}

        <Details GameResponse={GameResponse} />

        <RelatedGamesSlider relatedGames={relatedGames} />

        <SimilarGamesSlider SimilarGames={SimilarGames} />
      </div>
    </div>
  )
}
