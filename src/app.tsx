import { Link } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRef } from 'react'
import 'swiper/css'

import { useAuth } from './hooks/useAuth'
import userLibrary from './assets/Screenshot From 2025-07-03 18-09-08.png'
import { Button } from './components/button'
import { GameListSection } from './components/gameListSection'
import { GameCard } from './components/gamesComponents/gameCard'
import { useUserGames } from './hooks/useUserGames'
import { useGames } from './hooks/useGames'

const STAT_KEYS = [
  { label: 'Played', status: 'PLAYED' },
  { label: 'Playing', status: 'PLAYING' },
  { label: 'Backlog', status: 'BACKLOG' },
  { label: 'Wishlist', status: 'WISHLIST' }
] as const

export function App() {
  const { user } = useAuth()
  const isLogged = !!user?.id

  const { UserGamesResponse, GamesToDisplay } = useUserGames()
  const { gamesFeatured } = useGames(1, '', 'gameName', 'asc')

  const stableGame = useRef(GamesToDisplay)
  if (GamesToDisplay && !stableGame.current) {
    stableGame.current = GamesToDisplay
  }

  if (!gamesFeatured) return null

  return (
    <>
      {isLogged ? (
        <div className="flex flex-col gap-6 mt-8 w-full">
          <div className="">
            <h1 className="text-xl font-semibold text-white">
              Olá, <span className="text-[#7A38CA]">{user.userName}</span>
            </h1>

            <div className="flex gap-x-4">
              <div className="flex gap-5 mt-3 flex-wrap">
                {STAT_KEYS.map(({ label, status }) => {
                  const count =
                    UserGamesResponse?.totalPerStatus.find(
                      t => t.status === status
                    )?.totalGames ?? 0
                  return (
                    <div key={label} className="flex flex-col">
                      <span className="text-lg font-bold text-white leading-tight">
                        {count}
                      </span>
                      <span className="text-[11px] text-gray-600 uppercase tracking-widest">
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {stableGame.current?.game && (
                <Link
                  to={`/games/${stableGame.current.game.id}`}
                  className="inline-flex items-center gap-3 group w-fit"
                >
                  <img
                    src={stableGame.current.game.gameBanner}
                    alt={stableGame.current.game.gameName}
                    className="w-10 h-14 object-cover rounded flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-150"
                  />
                  <div className="min-w-0">
                    <p className="text-gray-600 text-xs mb-0.5">
                      {stableGame.current.message}
                    </p>
                    <p className="text-white text-sm font-medium group-hover:text-[#9D52E8] transition-colors duration-150 truncate">
                      {stableGame.current.game.gameName}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10">
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Organize seus jogos
              <br />
              com <span className="text-[#7A38CA]">Lib</span>
            </h1>
            <p className="text-gray-400 leading-relaxed max-w-md">
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

          <div className="order-first lg:order-last">
            <img
              src={userLibrary}
              alt="Screenshot da biblioteca"
              className="w-full rounded-lg border border-[#2A2B36]"
            />
          </div>
        </div>
      )}

      <section className="mt-10 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-[#7A38CA] pl-3 mb-5 uppercase tracking-wide">
          Lançamentos Recentes
        </h2>

        {gamesFeatured.recentGames.length > 0 ? (
          <Swiper
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 24 }
            }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            spaceBetween={12}
            loop={true}
            modules={[Autoplay]}
            className="h-64"
          >
            {gamesFeatured.recentGames.map(game => (
              <SwiperSlide
                key={game.id}
                className="!flex !items-center !justify-center"
              >
                <Link to={`/games/${game.id}`} className="block">
                  <GameCard game={game} size="larger" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-gray-600 text-sm">
            Nenhum jogo disponível no momento.
          </p>
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
