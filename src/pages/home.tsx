import { Link } from 'react-router-dom'
import { Gamepad2 } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef } from 'react'

import { useAuth } from '../hooks/useAuth'
import userLibrary from '../assets/Screenshot From 2025-07-03 18-09-08.png'
import { Button } from '../components/button'
import { GameListSection } from '../components/gameListSection'
import { GameCard } from '../components/gamesComponents/gameCard'
import { useUserGames } from '../hooks/useUserGames'
import { useGames } from '../hooks/useGames'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const STAT_KEYS = [
  { label: 'Jogado', status: 'PLAYED' },
  { label: 'Jogando', status: 'PLAYING' },
  { label: 'Pendentes', status: 'BACKLOG' },
  { label: 'Desejos', status: 'WISHLIST' }
] as const

export function Home() {
  const { user } = useAuth()
  const isLogged = !!user?.id

  const { UserGamesResponse, GamesToDisplay } = useUserGames()
  const { gamesFeatured } = useGames(1, '', 'name', 'asc')

  const stableGame = useRef(GamesToDisplay)
  if (GamesToDisplay && !stableGame.current) {
    stableGame.current = GamesToDisplay
  }

  const prefersReducedMotion = usePrefersReducedMotion()

  const recentGames = gamesFeatured?.recentGames ?? []
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: recentGames.length > 5, align: 'start', dragFree: true },
    prefersReducedMotion
      ? []
      : [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, recentGames.length])

  if (!gamesFeatured) return null

  return (
    <>
      {isLogged ? (
        <div className="w-full mt-8">
          <h1 className="text-xl font-semibold text-white">
            Olá, <span className="text-primary">{user.userName}</span>
          </h1>

          <div className="flex items-center flex-wrap gap-6 mt-4">
            <div className="flex gap-5 flex-wrap">
              {STAT_KEYS.map(({ label, status }) => {
                const count =
                  UserGamesResponse?.totalPerStatus.find(
                    t => t.status === status
                  )?.totalGames ?? 0
                const displayLabel =
                  count > 1 && label === 'Jogado' ? 'Jogados' : label
                return (
                  <div key={label} className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-tight">
                      {count}
                    </span>
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest">
                      {displayLabel}
                    </span>
                  </div>
                )
              })}
            </div>

            {stableGame.current?.game && (
              <Link
                to={`/games/${stableGame.current.game.igdbId}`}
                className="inline-flex items-center gap-3 group w-fit pl-6 border-l border-dark-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
              >
                {stableGame.current.game.coverUrl && (
                  <img
                    src={stableGame.current.game.coverUrl}
                    alt={stableGame.current.game.name}
                    className="w-10 h-14 object-cover rounded flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-150"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs mb-0.5">
                    {stableGame.current.message}
                  </p>
                  <p className="text-white text-sm font-medium group-hover:text-primary-light transition-colors duration-150 truncate">
                    {stableGame.current.game.name}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 pt-8 pb-12 lg:pt-14 lg:pb-20">
          <div className="lg:col-span-5 flex flex-col justify-start gap-5 lg:pt-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] max-w-md">
              Organize seus jogos com <span className="text-primary">Lib</span>
            </h1>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Marque o que jogou, está jogando ou quer jogar. Um projeto pessoal
              em desenvolvimento contínuo.
            </p>
            <div>
              <Link to="/auth?tab=signUp">
                <Button variant="primary" size="md">
                  Criar conta
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <img
              src={userLibrary}
              alt="Screenshot da biblioteca"
              className="w-full h-full object-cover border-t border-l border-dark-border lg:rounded-tl-xl"
            />
          </div>
        </section>
      )}

      <section className="mt-10 mb-6">
        <div className="flex items-baseline justify-between border-t border-dark-border pt-4 mb-5">
          <h2 className="text-lg font-semibold text-white">
            Lançamentos Recentes
          </h2>
        </div>

        {recentGames.length > 0 ? (
          <div className="overflow-hidden p-2" ref={emblaRef}>
            <div className="flex -ml-3">
              {recentGames.map(game => (
                <div key={game.igdbId} className="flex-none w-44 pl-3">
                  <Link
                    to={`/games/${game.igdbId}`}
                    className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                  >
                    <GameCard game={game} size="larger" interactive={false} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Gamepad2 className="size-4 shrink-0" />
            <span>Nenhum jogo disponível no momento.</span>
          </div>
        )}
      </section>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <GameListSection
          type="coming"
          games={gamesFeatured.futureGames}
          title="Em Breve"
        />
        <GameListSection
          type="trending"
          games={gamesFeatured.trendingGames}
          title="Em Alta"
        />
        <GameListSection
          type="rateds"
          games={gamesFeatured.mostRatedGames}
          title="Mais Avaliados"
        />
      </div>
    </>
  )
}
