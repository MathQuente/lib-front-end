import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useParams, useSearchParams } from 'react-router-dom'
import { useCommunityReviews } from '../hooks/useCommunityReviews'
import { CommunityReviewCard } from '../components/communityReviewCard'
import { Pagination } from '../components/pagination'
import { BackButton } from '../components/backButton'
import { StatusLink, StatusMessage } from '../components/statusMessage'
import { Button } from '../components/button'
import { api } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { isValidIgdbId } from '../utils/isValidIgdbId'
import { parsePage } from '../utils/parsePage'

const PAGE_SIZE = 10

export function GameReviewsPage() {
  const { igdbId } = useParams<{ igdbId: string }>()
  const { user } = useAuth()
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

  const isValidId = isValidIgdbId(igdbId)

  const { error: gameError } = useQuery({
    queryKey: ['game', igdbId],
    queryFn: () => api.getGame(igdbId),
    enabled: isValidId
  })

  const { reviews, total, isLoading, isError, refetch } = useCommunityReviews(
    isValidId ? igdbId : undefined,
    page - 1,
    PAGE_SIZE
  )

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  useEffect(() => {
    if (total > 0 && page > totalPages) setPage(totalPages)
  }, [total, page, totalPages])

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

  return (
    <>
      <BackButton className="mt-4" />

      <div className="w-full mt-2">
        <h1 className="text-lg font-semibold text-white mb-4">
          Resenhas da comunidade
        </h1>

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
            <Button variant="primary" size="md" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : reviews.length === 0 ? (
          <StatusMessage
            variant="empty"
            title="Nenhuma resenha pública ainda"
            description="Ninguém publicou uma resenha desse jogo. Você pode ser a primeira pessoa."
            primaryAction={
              user ? (
                <StatusLink to={`/games/${igdbId}`}>Escrever resenha</StatusLink>
              ) : (
                <StatusLink to="/auth?tab=login">Entrar para escrever</StatusLink>
              )
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map(review => (
              <CommunityReviewCard key={review.userId} review={review} />
            ))}
          </div>
        )}

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={reviews.length}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  )
}
