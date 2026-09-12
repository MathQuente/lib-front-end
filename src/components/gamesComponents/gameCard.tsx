import { useState } from 'react'
import { Star, RotateCcw, Clock, Gift, Play, Library, Gamepad2 } from 'lucide-react'
import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'
import { twMerge } from 'tailwind-merge'
import type { GameCardProps } from '../../interfaces/games'

const LIBRARY_STATUS_BADGES: Record<
  string,
  { icon: typeof Gift; barColor: string; iconColor: string; label: string }
> = {
  WISHLIST: {
    icon: Gift,
    barColor: 'bg-pink-400',
    iconColor: 'text-pink-400',
    label: 'Lista de desejos'
  },
  PLAYING: {
    icon: Play,
    barColor: 'bg-emerald-400',
    iconColor: 'text-emerald-400',
    label: 'Jogando'
  },
  BACKLOG: {
    icon: Library,
    barColor: 'bg-slate-400',
    iconColor: 'text-slate-400',
    label: 'Backlog'
  },
  PLAYED: {
    icon: Gamepad2,
    barColor: 'bg-amber-400',
    iconColor: 'text-amber-400',
    label: 'Jogado'
  }
}

const sizes = {
  small: 'w-14 h-16',
  medium: 'aspect-[7/10] w-full',
  compact: 'w-32 h-44',
  larger: 'w-44 h-56'
}

const CATEGORY_TAGS: Record<number, string> = {
  1: 'DLC',
  2: 'Expansão',
  3: 'Bundle',
  4: 'Expansão Standalone',
  6: 'Episódio',
  7: 'Temporada',
  8: 'Remake',
  9: 'Remaster',
  10: 'Edição Expandida',
  11: 'Port',
  13: 'Pacote',
  14: 'Atualização'
}

const TEXT_HINTS: Array<{ pattern: RegExp; tag: string }> = [
  { pattern: /\bremake\b|reimagin/i, tag: 'Remake' },
  { pattern: /\bremaster/i, tag: 'Remaster' },
  { pattern: /\bport\b/i, tag: 'Port' },
  {
    pattern:
      /definitive edition|enhanced edition|goty|game of the year edition|anniversary edition/i,
    tag: 'Edição Especial'
  }
]

export function getGameTag(
  name: string,
  summary: string | undefined,
  category: number | undefined,
  parentGameId: number | null | undefined
) {
  if (parentGameId == null) return null
  if (category !== undefined && CATEGORY_TAGS[category]) {
    return CATEGORY_TAGS[category]
  }

  for (const { pattern, tag } of TEXT_HINTS) {
    if (pattern.test(name) || (summary && pattern.test(summary))) return tag
  }

  return 'DLC/Edição'
}

export function GameCard({
  game,
  className,
  size = 'medium',
  enableModal,
  interactive = true
}: GameCardProps) {
  const [open, setOpen] = useState(false)
  const tag =
    game && size !== 'small'
      ? getGameTag(game.name, game.summary, game.category, game.parentGameId)
      : null

  const showRating = size !== 'small' && game?.rating != null
  const showCompletions =
    size !== 'small' &&
    game?.status === 'PLAYED' &&
    !!game?.completions &&
    game.completions > 0
  const showHoursPlayed =
    size !== 'small' && !!game?.hoursPlayed && game.hoursPlayed > 0
  const statusBadge =
    size !== 'small' && game?.status ? LIBRARY_STATUS_BADGES[game.status] : undefined
  const accentColor = statusBadge?.iconColor ?? 'text-primary'

  const cardClassName = twMerge(
    'group relative rounded-lg overflow-hidden hover:ring-1 ring-primary/40 transition-transform duration-200 hover:scale-[1.02]',
    interactive &&
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light',
    size === 'medium' ? 'block w-full' : sizes[size]
  )

  const cardContent = (
    <>
      {statusBadge && (
        <span
          className={`absolute top-0 inset-x-0 h-0.5 z-10 ${statusBadge.barColor}`}
          aria-hidden="true"
        />
      )}

      {tag && statusBadge ? (
        <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-dark-bg/90 border border-dark-border text-[10px] font-medium text-gray-300">
            {tag}
          </span>
          <span
            className="inline-flex items-center justify-center size-5 rounded-full bg-dark-bg/90 border border-dark-border shrink-0"
            title={statusBadge.label}
            aria-label={statusBadge.label}
          >
            <statusBadge.icon
              className={`size-2.5 ${statusBadge.iconColor}`}
              aria-hidden="true"
            />
          </span>
        </div>
      ) : (
        <>
          {tag && (
            <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-dark-bg/90 border border-dark-border text-[10px] font-medium text-gray-300">
              {tag}
            </span>
          )}
          {statusBadge && (
            <span
              className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center size-5 rounded-full bg-dark-bg/90 border border-dark-border"
              title={statusBadge.label}
              aria-label={statusBadge.label}
            >
              <statusBadge.icon
                className={`size-2.5 ${statusBadge.iconColor}`}
                aria-hidden="true"
              />
            </span>
          )}
        </>
      )}

      {showRating && (
        <span
          className="absolute bottom-1.5 left-1.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-dark-bg/90 border border-dark-border text-[10px] font-medium text-gray-200"
          title="Sua nota"
          aria-label={`Sua nota: ${game?.rating}`}
        >
          <Star
            className={`size-2.5 fill-current ${accentColor}`}
            aria-hidden="true"
          />
          <span aria-hidden="true">{game?.rating}</span>
        </span>
      )}

      {showCompletions && (
        <span
          className="absolute bottom-1.5 right-1.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-dark-bg/90 border border-dark-border text-[10px] font-medium text-gray-200"
          title="Vezes finalizado"
          aria-label={`Finalizado ${game?.completions}x`}
        >
          <RotateCcw className={`size-2.5 ${accentColor}`} aria-hidden="true" />
          <span aria-hidden="true">{game?.completions}</span>
        </span>
      )}

      {showHoursPlayed && (
        <span
          className="absolute top-1.5 right-1.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-dark-bg/90 border border-dark-border text-[10px] font-medium text-gray-200"
          title="Horas jogadas"
          aria-label={`${game?.hoursPlayed} horas jogadas`}
        >
          <Clock className={`size-2.5 ${accentColor}`} aria-hidden="true" />
          <span aria-hidden="true">
            {Number(game?.hoursPlayed?.toFixed(1))}h
          </span>
        </span>
      )}

      {game?.coverUrl ? (
        <img
          className={twMerge(
            sizes[size],
            'rounded-lg object-cover',
            size !== 'small' &&
              'transition-opacity duration-200 group-hover:opacity-20'
          )}
          src={game.coverUrl}
          alt={`${game?.name} banner`}
        />
      ) : (
        <div
          className={twMerge(
            sizes[size],
            'rounded-lg bg-dark-bg-lighter flex items-center justify-center'
          )}
        >
          <span className="text-gray-400 text-xs text-center px-1">
            Sem capa
          </span>
        </div>
      )}

      {size !== 'small' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-white font-semibold text-center px-3 text-sm md:text-base translate-y-2 group-hover:translate-y-0 transition-transform duration-200 drop-shadow-lg">
            {game?.name}
          </span>
        </div>
      )}
    </>
  )

  return (
    <>
      <div className={twMerge('flex justify-center', className)}>
        {interactive ? (
          <button
            type="button"
            onClick={() => enableModal && setOpen(true)}
            className={cardClassName}
          >
            {cardContent}
          </button>
        ) : (
          <div className={cardClassName}>{cardContent}</div>
        )}
      </div>

      {enableModal && (
        <GameModal
          open={open}
          onOpenChange={setOpen}
          title={game?.name ?? 'Detalhes do jogo'}
        >
          <GameInfo game={game} onClose={() => setOpen(false)} />
        </GameModal>
      )}
    </>
  )
}
