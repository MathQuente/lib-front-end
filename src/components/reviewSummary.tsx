import { Star } from 'lucide-react'
import { useRating } from '../hooks/useRating'

const STARS = [5, 4, 3, 2, 1]
const MIN_RATINGS_FOR_CHART = 6

export function ReviewSummary({ igdbId }: { igdbId: string }) {
  const { average, allRatingsResponse } = useRating(igdbId)

  const total =
    allRatingsResponse?.reduce((sum, item) => sum + item.count, 0) ?? 0
  const averageValue: number | null | undefined = average?.average

  if (!total || averageValue == null) return null

  const displayValue = (Math.floor(averageValue * 10) / 10).toLocaleString(
    'pt-BR',
    { minimumFractionDigits: 1, maximumFractionDigits: 1 }
  )
  const fullStars = Math.floor(averageValue)

  const counts = new Map<number, number>(STARS.map(star => [star, 0]))
  for (const item of allRatingsResponse ?? []) {
    const star = Math.min(5, Math.max(1, Math.floor(item.rating)))
    counts.set(star, (counts.get(star) ?? 0) + item.count)
  }
  const maxCount = Math.max(...counts.values(), 1)
  const showChart = total >= MIN_RATINGS_FOR_CHART

  return (
    <section
      aria-label="Resumo das notas"
      className="bg-dark-bg-light border border-dark-border rounded-lg p-5 grid gap-6 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] items-center"
    >
      <div className="flex flex-col gap-1.5">
        <p className="text-5xl font-semibold leading-none text-white">
          {displayValue}
          <span className="text-base font-normal text-gray-400"> de 5</span>
        </p>
        <div
          className="flex gap-0.5 text-primary-light"
          role="img"
          aria-label={`Nota média ${displayValue} de 5`}
        >
          {STARS.slice()
            .reverse()
            .map(star => (
              <Star
                key={star}
                className={`size-[18px] ${star <= fullStars ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
            ))}
        </div>
        <p className="text-sm text-gray-400">
          {total} {total === 1 ? 'nota' : 'notas'}
        </p>
      </div>

      {showChart && (
        <div className="flex flex-col gap-2">
          {STARS.map(star => {
            const count = counts.get(star) ?? 0
            return (
              <div
                key={star}
                className="grid grid-cols-[72px_minmax(0,1fr)_28px] items-center gap-3 text-sm text-gray-300"
              >
                <span>{star === 1 ? '1 estrela' : `${star} estrelas`}</span>
                <span
                  className="h-2 rounded bg-dark-bg-lighter overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded bg-primary-light"
                    style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                  />
                </span>
                <span className="text-right tabular-nums">{count}</span>
              </div>
            )
          })}
          <p className="text-xs text-gray-400 mt-0.5">
            Notas com meia estrela entram na faixa de baixo: 4,5 conta como 4
            estrelas.
          </p>
        </div>
      )}
    </section>
  )
}
