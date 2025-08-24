import { useState } from 'react'

import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'

import { twMerge } from 'tailwind-merge'
import type { GameBase } from '../../types/games'

interface GameCardProps {
  game: GameBase | undefined
  className?: string
  size?: 'small' | 'medium' | 'larger'
  enableModal?: boolean
}

export function GameCard({
  game,
  className,
  size = 'medium',
  enableModal
}: GameCardProps) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (enableModal) {
      setOpen(true)
    }
  }
  const sizes = {
    small: 'w-12 h-16 rounded-lg',
    medium:
      'rounded-lg w-44 h-32 sm:w-36 md:w-44 md:h-56 sm:h-40 lg:min-w-28 lg:h-44 xl:w-48 xl:h-52 2xl:w-48 2xl:min-h-64',
    larger: 'w-40 h-48 lg:w-44 lg:h-52 rounded-lg'
  }
  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={handleClick}
          className="transition-transform hover:scale-105 hover:ring-2 hover:ring-purple-500 rounded-lg"
        >
          <img
            className={twMerge(sizes[size])}
            src={game?.gameBanner}
            alt={`${game?.gameName} banner`}
          />
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
