import type { ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Gamepad2, Users } from 'lucide-react'
import { useGames } from '../hooks/useGames'
import { useUserSearch } from '../hooks/useUserSearch'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button } from '../components/button'
import { EmptyState } from '../components/emptyState'
import { GameCard } from '../components/gamesComponents/gameCard'
import { BackButton } from '../components/backButton'
import { SectionHeading } from '../components/sectionHeading'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'

type SearchTab = 'todos' | 'jogos' | 'pessoas'

export function SearchResults() {
  const { query } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: SearchTab =
    searchParams.get('tab') === 'jogos' || searchParams.get('tab') === 'pessoas'
      ? (searchParams.get('tab') as SearchTab)
      : 'todos'

  function handleTabChange(next: SearchTab) {
    setSearchParams(next === 'todos' ? {} : { tab: next }, { replace: true })
  }

  const {
    GamesResponseInfinity,
    fetchNextPage,
    hasNextPage,
    isLoadingInfinite,
    isErrorInfinite,
    refetchInfinite
  } = useGames(1, query, 'name', 'asc', 10)

  const { users, isLoading: isLoadingUsers } = useUserSearch(query ?? '')

  const resultForSearchGames =
    GamesResponseInfinity?.pages.flatMap(page => page.games) ?? []
  const totalGames = GamesResponseInfinity?.pages[0]?.total ?? 0

  const showGames = tab === 'todos' || tab === 'jogos'
  const showPeople = tab === 'todos' || tab === 'pessoas'

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
      active
        ? 'bg-primary text-white font-semibold'
        : 'text-gray-400 hover:text-white'
    }`

  let gamesSection: ReactNode

  if (isLoadingInfinite) {
    gamesSection = (
      <div className="flex flex-col gap-4 mt-4 animate-pulse">
        {Array.from({ length: 5 }, (_, i) => `sk${i}`).map(k => (
          <div key={k} className="flex gap-4 p-4">
            <div className="w-32 h-40 rounded-lg bg-dark-bg-light flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-3 py-1">
              <div className="h-5 bg-dark-bg-light rounded w-3/4" />
              <div className="h-4 bg-dark-bg-light rounded w-1/3" />
              <div className="h-3 bg-dark-bg-light rounded w-full" />
              <div className="h-3 bg-dark-bg-light rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    )
  } else if (isErrorInfinite) {
    gamesSection = (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erro ao carregar jogos</p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => refetchInfinite()}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  } else if (resultForSearchGames.length === 0) {
    gamesSection = (
      <EmptyState
        title="Nenhum jogo encontrado"
        description={
          query ? (
            <span>
              Não encontramos resultados para{' '}
              <span className="text-primary font-medium">"{query}"</span>.
              Tente termos diferentes ou verifique a ortografia.
            </span>
          ) : (
            'Não há jogos disponíveis no momento.'
          )
        }
      />
    )
  } else {
    gamesSection = (
      <InfiniteScroll
        dataLength={resultForSearchGames.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              <p className="text-gray-400">Carregando mais jogos...</p>
            </div>
          </div>
        }
      >
        {resultForSearchGames.map(game => (
          <div key={game.igdbId}>
            <Link
              to={`/games/${game.igdbId}`}
              className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg hover:bg-dark-bg-lighter transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
            >
              <div className="w-full sm:w-auto flex-shrink-0">
                <GameCard game={game} size="larger" interactive={false} />
              </div>

              <div className="flex-1 w-full sm:w-auto min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-white font-semibold text-lg sm:text-xl group-hover:text-primary transition-colors duration-200 truncate">
                    {game.name}
                  </h2>
                  {game.releaseDate && (
                    <span className="text-sm text-gray-300 bg-dark-bg-lighter border border-dark-border rounded-full px-2.5 py-1 self-start sm:self-center flex-shrink-0">
                      {dayjs.unix(game.releaseDate).format('YYYY')}
                    </span>
                  )}
                </div>

                {game.platforms && game.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="break-words">
                        {game.platforms.join(', ')}
                      </span>
                    </span>
                  </div>
                )}

                {game.summary && (
                  <p className="text-gray-300 text-sm line-clamp-2 sm:line-clamp-3 break-words">
                    {game.summary}
                  </p>
                )}
              </div>
            </Link>

            <div className="border-b border-dark-border mt-4 mb-4" />
          </div>
        ))}
      </InfiniteScroll>
    )
  }

  const peopleSection = isLoadingUsers ? (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: 2 }, (_, i) => `sk${i}`).map(k => (
        <div key={k} className="h-12 rounded-lg bg-dark-bg-lighter" />
      ))}
    </div>
  ) : users.length === 0 ? (
    <EmptyState
      title="Nenhuma pessoa encontrada"
      description={
        query ? (
          <span>
            Não encontramos usuários para{' '}
            <span className="text-primary font-medium">"{query}"</span>.
          </span>
        ) : (
          'Não há usuários pra mostrar no momento.'
        )
      }
    />
  ) : (
    <div className="flex flex-col gap-2">
      {users.map(u => (
        <Link
          key={u.id}
          to={`/users/${u.id}`}
          className="flex items-center gap-3 rounded-lg hover:bg-dark-bg-lighter px-2 py-2 -mx-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
        >
          <img
            src={u.profilePicture || userProfilePictureDefault}
            alt=""
            className="size-9 rounded-full object-cover border border-dark-border shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {u.userName ?? 'Usuário'}
            </p>
            <p className="text-xs text-gray-400">
              {u.userGamesAmount} {u.userGamesAmount === 1 ? 'jogo' : 'jogos'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )

  return (
    <>
      <BackButton className="mt-4 mb-2" />

      <h1 className="text-center sm:text-left mb-4">
        <span className="text-white text-lg sm:text-xl font-bold break-words">
          Resultados para "{query}"
        </span>
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleTabChange('todos')}
          className={tabClass(tab === 'todos')}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('jogos')}
          className={tabClass(tab === 'jogos')}
        >
          Jogos ({totalGames})
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('pessoas')}
          className={tabClass(tab === 'pessoas')}
        >
          Pessoas ({users.length})
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {showPeople && (isLoadingUsers || users.length > 0 || tab === 'pessoas') && (
          <div className="bg-dark-bg-light border border-dark-border rounded-lg px-6 py-4">
            <SectionHeading icon={Users}>Pessoas</SectionHeading>
            {peopleSection}
          </div>
        )}

        {showGames && (
          <div className={tab === 'todos' ? 'bg-dark-bg-light border border-dark-border rounded-lg px-6 py-4' : ''}>
            {tab === 'todos' && <SectionHeading icon={Gamepad2}>Jogos</SectionHeading>}
            {gamesSection}
          </div>
        )}
      </div>
    </>
  )
}
