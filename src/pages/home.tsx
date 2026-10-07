import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { GameListSection } from '../components/gameListSection'
import { GameCard } from '../components/gamesComponents/gameCard'
import { CoverRow } from '../components/homeComponents/coverRow'
import { LibrarySummary } from '../components/homeComponents/librarySummary'
import { LoggedOutHero } from '../components/homeComponents/loggedOutHero'
import { NextUp } from '../components/homeComponents/nextUp'
import { PlayingNow } from '../components/homeComponents/playingNow'
import {
  coverLink,
  sectionTitle,
  textLink,
} from '../components/homeComponents/styles'
import { useAuth } from '../hooks/useAuth'
import { useGames } from '../hooks/useGames'
import { useUserGames } from '../hooks/useUserGames'
import type { GamesFromHomePageResponse } from '../types/games'

const WALL_LIMIT = 60

const SKELETON_COVERS = ['a', 'b', 'c', 'd', 'e', 'f']

function LoggedInTop() {
  const {
    UserGamesResponse,
    isLoadingUserGames,
    isErrorUserGames,
    GamesToDisplay,
    gamesByStatus,
    totalPerStatus,
  } = useUserGames()

  const libraryIds = useMemo(
    () =>
      new Set(
        Object.values(gamesByStatus).flatMap(games =>
          games.map(game => game.igdbId)
        )
      ),
    [gamesByStatus]
  )

  if (!UserGamesResponse) {
    if (isErrorUserGames) {
      return (
        <p className="mt-4 text-gray-400">
          Não foi possível carregar sua biblioteca agora.
        </p>
      )
    }

    return (
      <div
        className="mt-2 grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14"
        aria-busy={isLoadingUserGames}
      >
        <div className="h-56 rounded-lg bg-dark-bg-light lg:h-80" />
        <div className="h-56 rounded-lg bg-dark-bg-light lg:h-80" />
      </div>
    )
  }

  const playing = gamesByStatus.PLAYING
  const backlog = gamesByStatus.BACKLOG
  const playingTotal =
    totalPerStatus.find(t => t.status === 'PLAYING')?.totalGames ??
    playing.length

  if (UserGamesResponse.total === 0) {
    const hasSuggestion =
      !!GamesToDisplay?.game && !libraryIds.has(GamesToDisplay.game.igdbId)

    return (
      <div className="mt-2 grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
        <section className="min-w-0">
          <h2 className="max-w-md text-balance font-display text-2xl font-extrabold leading-tight tracking-tight text-white lg:text-3xl">
            Sua biblioteca ainda está vazia.
          </h2>
          <p className="mt-3 max-w-md text-gray-400">
            Os jogos que você marcar como Jogando e Pendente aparecem aqui.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              to="/games"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-base font-bold text-white transition-colors duration-200 hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light active:scale-[0.98]"
            >
              Explorar jogos
            </Link>
            <Link to="/userLibrary" className={textLink}>
              Importar da Steam ou PSN
            </Link>
          </div>
        </section>
        {hasSuggestion && (
          <NextUp
            backlog={backlog}
            libraryIds={libraryIds}
            suggestion={GamesToDisplay}
            title="Uma sugestão para começar"
            showEmptyNote={false}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mt-2 grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
        <PlayingNow games={playing} total={playingTotal} />
        <NextUp
          backlog={backlog}
          libraryIds={libraryIds}
          suggestion={GamesToDisplay}
        />
      </div>
      <LibrarySummary totalPerStatus={totalPerStatus} />
    </>
  )
}

function Discovery({
  featured,
  isLoading,
}: {
  featured: GamesFromHomePageResponse | undefined
  isLoading: boolean
}) {
  if (!featured) {
    if (!isLoading) {
      return (
        <p className="mt-12 text-gray-400">
          Não foi possível carregar os jogos agora. Recarregue a página para
          tentar de novo.
        </p>
      )
    }

    return (
      <div className="mt-12" aria-busy="true">
        <h2 className={sectionTitle}>Lançamentos recentes</h2>
        <div className="mt-4 flex gap-3 overflow-hidden lg:gap-4">
          {SKELETON_COVERS.map(key => (
            <div
              key={key}
              className="aspect-[7/10] w-28 flex-none rounded-lg bg-dark-bg-light sm:w-36 lg:w-40"
            />
          ))}
        </div>
      </div>
    )
  }

  const recentGames = featured.recentGames

  return (
    <>
      <section className="mt-12 min-w-0">
        <h2 className={sectionTitle}>Lançamentos recentes</h2>
        {recentGames.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            Nenhum jogo disponível no momento.
          </p>
        ) : (
          <>
            <CoverRow games={recentGames} className="mt-4 lg:hidden" />
            <ul className="mt-4 hidden gap-4 lg:flex">
              {recentGames.map(game => (
                <li key={game.igdbId} className="w-40 min-w-0 xl:w-44">
                  <Link
                    to={`/games/${encodeURIComponent(game.igdbId)}`}
                    className={coverLink}
                  >
                    <GameCard game={game} size="medium" interactive={false} />
                    <p className="mt-2 line-clamp-2 text-sm leading-snug text-white">
                      {game.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="mt-12 grid w-full grid-cols-1 gap-10 border-t border-dark-border pt-8 lg:grid-cols-3 lg:gap-12">
        <GameListSection
          type="coming"
          games={featured.futureGames}
          title="Em breve"
        />
        <GameListSection
          type="trending"
          games={featured.trendingGames}
          title="Em alta"
        />
        <GameListSection
          type="rateds"
          games={featured.mostRatedGames}
          title="Mais avaliados"
        />
      </div>
    </>
  )
}

export function Home() {
  const { user } = useAuth()
  const isLogged = !!user?.id

  const { GamesResponse, gamesFeatured, isLoadingFeatured } = useGames(
    1,
    '',
    'rating',
    'desc',
    isLogged ? undefined : WALL_LIMIT
  )

  const wallCovers = useMemo(() => {
    const games = [
      ...(GamesResponse?.games ?? []),
      ...(gamesFeatured?.mostRatedGames ?? []),
      ...(gamesFeatured?.trendingGames ?? []),
      ...(gamesFeatured?.recentGames ?? []),
      ...(gamesFeatured?.futureGames ?? []),
    ]
    const byId = new Map<number, string>()
    for (const game of games) {
      if (game.coverUrl && !byId.has(game.igdbId)) {
        byId.set(game.igdbId, game.coverUrl)
      }
    }
    return [...byId.values()]
  }, [GamesResponse, gamesFeatured])

  return (
    <>
      {isLogged ? (
        <>
          <h1 className="sr-only">Início</h1>
          <LoggedInTop />
        </>
      ) : (
        <LoggedOutHero covers={wallCovers} />
      )}

      <Discovery featured={gamesFeatured} isLoading={isLoadingFeatured} />
    </>
  )
}
