import { Star } from 'lucide-react'
import { useState } from 'react'
import { useRating } from '../hooks/useRating'
import type { RatingChartProps } from '../interfaces/games'
import { focusRing } from '../styles/focus'

const BINS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
const MIN_RATINGS_FOR_CHART = 6
const nf = new Intl.NumberFormat('pt-BR')

export function RatingChart({ GameResponse }: RatingChartProps) {
  const { allRatingsResponse, userRating } = useRating(
    GameResponse.game.igdbId.toString()
  )

  const [active, setActive] = useState<number | null>(null)

  if (!allRatingsResponse) return null

  const byValue = new Map<number, number>(
    allRatingsResponse.map(r => [Number(r.rating), r.count])
  )
  const counts = BINS.map(b => byValue.get(b) ?? 0)
  const total = counts.reduce((a, b) => a + b, 0)
  const max = Math.max(...counts)
  const activeCount = active === null ? 0 : counts[BINS.indexOf(active)]
  const plural = total === 1 ? 'avaliação' : 'avaliações'

  if (total < MIN_RATINGS_FOR_CHART) {
    return (
      <p className="text-sm text-gray-400">
        {total === 0
          ? 'Ainda sem avaliações.'
          : `${nf.format(total)} ${plural}. A distribuição aparece a partir de ${MIN_RATINGS_FOR_CHART}.`}
      </p>
    )
  }

  return (
    <figure className="flex flex-col gap-1.5">
      <p className="min-h-4 text-xs text-gray-300" aria-hidden="true">
        {active !== null &&
          `${nf.format(active)}★: ${nf.format(activeCount)} ${activeCount === 1 ? 'avaliação' : 'avaliações'} · ${Math.round((activeCount / total) * 100)}%`}
      </p>
      <div className="flex h-24 items-end gap-0.5">
        {BINS.map((bin, i) => (
          <button
            key={bin}
            type="button"
            aria-label={`${nf.format(bin)} ${bin === 1 ? 'estrela' : 'estrelas'}: ${nf.format(counts[i])} ${counts[i] === 1 ? 'avaliação' : 'avaliações'}`}
            onPointerEnter={e => e.pointerType === 'mouse' && setActive(bin)}
            onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
            onFocus={() => setActive(bin)}
            onBlur={() => setActive(null)}
            className={`flex h-full flex-1 items-end rounded-t ${focusRing}`}
          >
            <span
              className={`block w-full rounded-t ${
                userRating === bin || active === bin
                  ? 'bg-primary-hover-light'
                  : 'bg-primary-light'
              }`}
              style={{
                height: `${Math.max(counts[i] > 0 ? 4 : 1, (counts[i] / max) * 100)}%`,
              }}
            />
          </button>
        ))}
      </div>
      <div
        className="flex gap-0.5 text-xs font-medium text-gray-300"
        aria-hidden="true"
      >
        {BINS.map(bin => (
          <span
            key={bin}
            className={`flex-1 text-center ${active === bin ? 'font-bold text-white' : ''}`}
          >
            {nf.format(bin)}
            <Star className="ml-0.5 inline size-3 fill-current align-[-1px]" />
          </span>
        ))}
      </div>
      <p className="mt-0.5 border-t border-dark-border pt-2 text-center text-sm text-gray-300">
        <span className="text-lg font-bold text-white">{nf.format(total)}</span>{' '}
        {plural}
      </p>
    </figure>
  )
}
