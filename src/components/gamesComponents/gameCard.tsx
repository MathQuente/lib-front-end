import { useState } from 'react'
import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'
import { twMerge } from 'tailwind-merge'
import type { GameCardProps } from '../../interfaces/games'

const sizes = {
  small: 'w-14 h-16',
  medium: 'aspect-[7/10] w-full',
  larger: 'w-44 h-56'
}

const CATEGORY_TAGS: Record<number, string> = {
  1: 'DLC',
  2: 'Expansão',
  4: 'Expansão Standalone',
  6: 'Episódio',
  7: 'Temporada',
  8: 'Remake',
  9: 'Remaster',
  10: 'Edição Expandida',
  11: 'Port'
}

// Título muitas vezes não distingue (ex: remakes/ports reaproveitam o nome
// original sem sufixo), mas a sinopse da IGDB quase sempre descreve o que
// aquela versão é ("this port of...", "is a remake of...", "HD remaster").
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

function getGameTag(
  name: string,
  summary: string,
  category: number,
  parentGameId: number | null
) {
  if (parentGameId == null) return null
  if (CATEGORY_TAGS[category]) return CATEGORY_TAGS[category]

  for (const { pattern, tag } of TEXT_HINTS) {
    if (pattern.test(name) || pattern.test(summary)) return tag
  }

  return 'DLC/Edição'
}

export function GameCard({
  game,
  className,
  size = 'medium',
  enableModal
}: GameCardProps) {
  const [open, setOpen] = useState(false)
  const tag =
    game && size !== 'small'
      ? getGameTag(game.name, game.summary, game.category, game.parentGameId)
      : null

  return (
    <>
      <div className={twMerge('flex justify-center', className)}>
        <button
          type="button"
          onClick={() => enableModal && setOpen(true)}
          className={twMerge(
            'group relative rounded-lg overflow-hidden transition-transform duration-200',
            size !== 'small' &&
              'hover:scale-105 hover:ring-2 ring-primary block w-full',
            size === 'small' && 'hover:ring-2 ring-primary'
          )}
        >
          {tag && (
            <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-dark-bg/90 border border-dark-border text-[10px] font-medium text-gray-300">
              {tag}
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
              <span className="text-gray-600 text-xs text-center px-1">
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
        </button>
      </div>

      {enableModal && (
        <GameModal open={open} onOpenChange={setOpen}>
          <GameInfo game={game} onClose={() => setOpen(false)} />
        </GameModal>
      )}
    </>
  )
}
