import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  Link,
  useNavigationType,
  useParams,
  useSearchParams
} from 'react-router-dom'
import { useCommunityReviews } from '../hooks/useCommunityReviews'
import { CommunityReviewCard } from '../components/communityReviewCard'
import { BackButton } from '../components/backButton'
import { Pagination } from '../components/pagination'
import { StatusLink, StatusMessage } from '../components/statusMessage'
import { Button } from '../components/button'
import { OwnReviewCard } from '../components/ownReviewCard'
import { ReviewSummary } from '../components/reviewSummary'
import { api } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { useReview } from '../hooks/useReview'
import { focusRing } from '../styles/focus'
import { hiResCover } from '../utils/hiResCover'
import { isValidIgdbId } from '../utils/isValidIgdbId'
import { parsePage } from '../utils/parsePage'
import type { GameResponse } from '../types/games'

const PAGE_SIZE = 10

export function GameReviewsPage() {
  const { igdbId } = useParams<{ igdbId: string }>()
  const { user } = useAuth()
  const isValidId = isValidIgdbId(igdbId)
  const listRef = useRef<HTMLDivElement>(null)
  const navigationType = useNavigationType()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))

  function setPage(next: number) {
    setSearchParams(
      prev => {
        const params = new URLSearchParams(prev)
        if (next <= 1) params.delete('page')
        else params.set('page', String(next))
        return params
      },
      { replace: true }
    )
  }

  const { data: gameData, error: gameError } = useQuery<GameResponse>({
    queryKey: ['game', igdbId],
    queryFn: () => api.getGame(igdbId),
    enabled: isValidId
  })
  const game = gameData?.game

  const { review: ownReview } = useReview(isValidId ? igdbId : undefined)

  const { reviews, total, isLoading, isError, refetch } = useCommunityReviews(
    isValidId ? igdbId : undefined,
    page - 1,
    PAGE_SIZE
  )
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  // O router mantém a rolagem ao navegar (vindo de "Ver todas", lá embaixo na página do jogo).
  // Entrando na página, volta ao topo; na volta pelo navegador (POP), deixa a rolagem restaurada.
  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [igdbId])

  useEffect(() => {
    if (total > 0 && page > totalPages) setPage(totalPages)
  }, [total, page, totalPages])

  function handlePageChange(next: number) {
    setPage(next)
    listRef.current?.scrollIntoView({ block: 'start' })
  }

  const isGameNotFound =
    isAxiosError(gameError) && gameError.response?.status === 404

  if (!isValidId || isGameNotFound) {
    return (
      <>
        <BackButton className="mt-4" />
        <StatusMessage
          variant="not-found"
          title="Jogo não encontrado"
          description="Não há resenhas porque esse jogo não existe no catálogo."
          primaryAction={<StatusLink to="/games">Ver catálogo</StatusLink>}
        />
      </>
    )
  }

  const hasOwn = Boolean(ownReview)
  const others = reviews.filter(review => review.userId !== user?.id)
  const othersTotal = Math.max(total - (hasOwn ? 1 : 0), 0)

  return (
    <div className="w-full max-w-[960px] mx-auto flex flex-col gap-5">
      <BackButton className="mt-4" />

      <div className="flex items-center gap-4">
        {game?.coverUrl ? (
          <img
            src={hiResCover(game.coverUrl)}
            alt=""
            className="w-14 h-[76px] shrink-0 rounded-md object-cover border border-dark-border"
          />
        ) : (
          <div
            className="w-14 h-[76px] shrink-0 rounded-md border border-dark-border bg-dark-bg-lighter flex items-center justify-center text-[11px] text-gray-400"
            aria-hidden="true"
          >
            capa
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white text-balance">
            Resenhas da comunidade
          </h1>
          {game ? (
            <p className="text-sm text-gray-400">
              <Link
                to={`/games/${igdbId}`}
                className={`text-primary-link hover:text-white transition-colors rounded-sm ${focusRing}`}
              >
                {game.name}
              </Link>{' '}
              · voltar para a página do jogo
            </p>
          ) : (
            <div className="mt-1 h-4 w-40 rounded bg-dark-bg-lighter animate-pulse" />
          )}
        </div>
      </div>

      <ReviewSummary igdbId={igdbId} />

      {game && (
        <OwnReviewCard
          igdbId={igdbId}
          gameName={game.name}
          releaseDate={game.releaseDate}
        />
      )}

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => `sk${i}`).map(k => (
              <div
                key={k}
                className="h-32 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-lg border border-dark-border bg-dark-bg-light px-4 py-3"
          >
            <div>
              <p className="text-red-400 text-sm">
                Não foi possível carregar as resenhas
              </p>
              <p className="text-gray-400 text-xs">
                Verifique a conexão e tente de novo.
              </p>
            </div>
            <Button variant="secondary" size="md" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : total === 0 ? (
          <StatusMessage
            variant="empty"
            title="Nenhuma resenha pública ainda"
            description="Ninguém publicou uma resenha desse jogo."
          />
        ) : others.length === 0 ? (
          <>
            <p className="text-sm text-gray-400">
              {page === 1
                ? 'Ninguém mais publicou uma resenha desse jogo.'
                : 'Não há outras resenhas nesta página.'}
            </p>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={othersTotal}
                itemsPerPage={0}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400">
              {othersTotal} {othersTotal === 1 ? 'resenha' : 'resenhas'}
              {hasOwn ? ' de outras pessoas' : ''}
            </p>
            <div ref={listRef} className="flex flex-col gap-3 scroll-mt-6">
              {others.map(review => (
                <CommunityReviewCard
                  key={review.userId}
                  review={review}
                  expandable
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={othersTotal}
              itemsPerPage={others.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
