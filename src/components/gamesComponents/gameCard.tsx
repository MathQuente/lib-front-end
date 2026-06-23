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

export function GameCard({
  game,
  className,
  size = 'medium',
  enableModal
}: GameCardProps) {
  const [open, setOpen] = useState(false)

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
