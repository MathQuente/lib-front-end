import { useEffect, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../components/button'
import { StatusMessage } from '../components/statusMessage'
import { BackButton } from '../components/backButton'
import { Pagination } from '../components/pagination'
import { SearchResultCard } from '../components/searchResultCard'
import { rowLink } from '../components/homeComponents/styles'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import { SEARCH_PAGE_SIZE, useGameSearch } from '../hooks/useGameSearch'
import { useUserSearch } from '../hooks/useUserSearch'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { parsePage } from '../utils/parsePage'

const USERS_PAGE_SIZE = 30

const tabClass = (active: boolean) =>
  `px-3 py-1.5 text-sm rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
    active ? 'bg-primary text-white font-semibold' : 'text-gray-400 hover:text-white'
  }`

const GAMES_GRID =
  'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-x-3 sm:gap-x-4 gap-y-5'

function GamesSkeleton() {
  return (
    <div className={`grid ${GAMES_GRID} animate-pulse`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => `sk${i}`).map(k => (
        <div key={k} className="flex flex-col gap-1.5">
          <div className="aspect-[7/10] w-full rounded-lg bg-dark-bg-lighter" />
          <div className="h-3 w-4/5 rounded bg-dark-bg-lighter" />
          <div className="h-3 w-1/4 rounded bg-dark-bg-lighter" />
        </div>
      ))}
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-1 animate-pulse" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => `sk${i}`).map(k => (
        <div key={k} className="flex items-center gap-3 p-2">
          <div className="w-11 aspect-[7/10] rounded-lg bg-dark-bg-lighter shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-2/3 rounded bg-dark-bg-lighter" />
            <div className="h-3 w-1/3 rounded bg-dark-bg-lighter" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchResults() {
  const { query } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'pessoas' ? 'pessoas' : 'jogos'
  const page = parsePage(searchParams.get('page'))
  const listRef = useRef<HTMLDivElement>(null)

  const {
    games,
    total,
    isLoading: isLoadingGames,
    isError: isErrorGames,
    isPlaceholderData,
    refetch: refetchGames
  } = useGameSearch(query, page)

  const {
    users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers
  } = useUserSearch(query ?? '')

  const totalPages = Math.max(Math.ceil(total / SEARCH_PAGE_SIZE), 1)
  const usersLabel =
    users.length >= USERS_PAGE_SIZE ? `${USERS_PAGE_SIZE}+` : users.length
  const showsPageInTitle =
    tab === 'jogos' && !isLoadingGames && page > 1 && page <= totalPages

  useDocumentTitle(
    query
      ? `Busca: ${query}${showsPageInTitle ? ` (página ${page} de ${totalPages})` : ''}`
      : 'Busca'
  )

  useEffect(() => {
    if (tab === 'jogos' && total > 0 && page > totalPages) {
      setSearchParams(
        prev => {
          const params = new URLSearchParams(prev)
          if (totalPages <= 1) params.delete('page')
          else params.set('page', String(totalPages))
          return params
        },
        { replace: true }
      )
    }
  }, [tab, total, page, totalPages, setSearchParams])

  function handlePageChange(next: number) {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      if (next <= 1) params.delete('page')
      else params.set('page', String(next))
      return params
    })
    listRef.current?.scrollIntoView({ block: 'start' })
  }

  let statusText = ''
  if (tab === 'jogos') {
    if (isLoadingGames) statusText = 'Buscando jogos…'
    else if (!isErrorGames)
      statusText = `${total} ${total === 1 ? 'jogo encontrado' : 'jogos encontrados'} para “${query}”`
  } else if (isLoadingUsers) {
    statusText = 'Buscando pessoas…'
  } else if (!isErrorUsers) {
    statusText = `${usersLabel} ${users.length === 1 ? 'pessoa encontrada' : 'pessoas encontradas'} para “${query}”`
  }

  const emptyDescription = (kind: string) =>
    query ? (
      <span>
        Não encontramos {kind} para{' '}
        <span className="text-primary-link font-medium">"{query}"</span>.
        Tente termos diferentes ou verifique a ortografia.
      </span>
    ) : (
      `Não há ${kind} disponíveis no momento.`
    )

  const isOutOfRange = !isErrorGames && games.length === 0 && total > 0

  const gamesSection = isLoadingGames || isOutOfRange ? (
    <GamesSkeleton />
  ) : isErrorGames ? (
    <div role="alert">
      <StatusMessage
        variant="empty"
        icon="offline"
        title="Não foi possível buscar jogos"
        description="A conexão falhou ou o servidor não respondeu. Tente de novo em instantes."
        primaryAction={
          <Button variant="secondary" size="md" onClick={() => refetchGames()}>
            Tentar novamente
          </Button>
        }
      />
    </div>
  ) : games.length === 0 ? (
    <StatusMessage
      variant="empty"
      title="Nenhum jogo encontrado"
      description={emptyDescription('jogos')}
    />
  ) : (
    <>
      {!isLoadingUsers && users.length > 0 && page === 1 && (
        <p className="mb-3 text-sm text-gray-400">
          {usersLabel} {users.length === 1 ? 'pessoa também combina' : 'pessoas também combinam'}{' '}
          com a busca.{' '}
          <Link
            to="?tab=pessoas"
            className="text-primary-link hover:text-white transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            Ver pessoas
          </Link>
        </p>
      )}
      <ul
        className={`grid ${GAMES_GRID} transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}
        aria-busy={isPlaceholderData}
      >
        {games.map(game => (
          <SearchResultCard key={game.igdbId} game={game} />
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={games.length}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )

  const peopleSection = isLoadingUsers ? (
    <SkeletonRows />
  ) : isErrorUsers ? (
    <div role="alert">
      <StatusMessage
        variant="empty"
        icon="offline"
        title="Não foi possível buscar pessoas"
        description="A conexão falhou ou o servidor não respondeu. Tente de novo em instantes."
        primaryAction={
          <Button variant="secondary" size="md" onClick={() => refetchUsers()}>
            Tentar novamente
          </Button>
        }
      />
    </div>
  ) : users.length === 0 ? (
    <StatusMessage
      variant="empty"
      title="Nenhuma pessoa encontrada"
      description={emptyDescription('usuários')}
    />
  ) : (
    <ul className="flex flex-col">
      {users.map(u => (
        <li key={u.id}>
          <Link to={`/users/${u.id}`} className={rowLink}>
            <img
              src={u.profilePicture || userProfilePictureDefault}
              alt=""
              className="size-9 rounded-full object-cover border border-dark-border shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {u.userName ?? 'Usuário'}
              </p>
              <p className="text-xs text-gray-400">
                {u.userGamesAmount} {u.userGamesAmount === 1 ? 'jogo' : 'jogos'}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <BackButton className="mt-4 mb-2" />

      <h1 className="mb-1 text-center sm:text-left text-white text-lg sm:text-xl font-bold break-words">
        Resultados para "{query}"
      </h1>
      <p
        role="status"
        className="mb-4 min-h-5 text-center sm:text-left text-sm text-gray-400"
      >
        {statusText}
      </p>

      <nav aria-label="Tipo de resultado" className="mb-4 flex items-center gap-2">
        <Link
          to="?"
          aria-current={tab === 'jogos' ? 'page' : undefined}
          className={tabClass(tab === 'jogos')}
        >
          Jogos{!isLoadingGames && !isErrorGames ? ` (${total})` : ''}
        </Link>
        <Link
          to="?tab=pessoas"
          aria-current={tab === 'pessoas' ? 'page' : undefined}
          className={tabClass(tab === 'pessoas')}
        >
          Pessoas{!isLoadingUsers && !isErrorUsers ? ` (${usersLabel})` : ''}
        </Link>
      </nav>

      <div ref={listRef} className="scroll-mt-4">
        {tab === 'jogos' ? gamesSection : peopleSection}
      </div>
    </>
  )
}
