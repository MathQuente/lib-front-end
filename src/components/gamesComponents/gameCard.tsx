import { useState } from 'react'
import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'
import { twMerge } from 'tailwind-merge'
import type { GameCardProps } from '../../interfaces/games.interfaces'

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
          {game?.isDlc && (
            <span className="absolute top-2 left-2 z-10 bg-dark-bg-light/90 px-1.5 py-0.5 rounded text-white text-xs font-medium">
              DLC
            </span>
          )}

          <img
            className={twMerge(
              sizes[size],
              'rounded-lg object-cover',
              size !== 'small' &&
                'transition-opacity duration-200 group-hover:opacity-20'
            )}
            src={game?.gameBanner}
            alt={`${game?.gameName} banner`}
          />

          {size !== 'small' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white font-semibold text-center px-3 text-sm md:text-base translate-y-2 group-hover:translate-y-0 transition-transform duration-200 drop-shadow-lg">
                {game?.gameName}
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
