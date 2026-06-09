import { IoGameController, IoLibrary } from 'react-icons/io5'
import type { GameResponse } from '../types/games'
import { FaGift, FaPlay, FaStar } from 'react-icons/fa'

interface PlayerInfosProps {
  GameResponse: GameResponse
}

const rows = [
  { icon: IoGameController, label: 'Played', key: 'PLAYED' },
  { icon: FaPlay, label: 'Playing', key: 'PLAYING' },
  { icon: IoLibrary, label: 'Backlog', key: 'BACKLOCK' },
  { icon: FaGift, label: 'Wishlist', key: 'WISHLIST' }
] as const

export function PlayersInfo({ GameResponse }: PlayerInfosProps) {
  const { userGames, amountOfRatings } = GameResponse.game

  return (
    <div className="flex flex-col gap-1 py-2 border-t border-[#2A2B36]">
      {rows.map(({ icon: Icon, label, key }) => (
        <div key={key} className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Icon className="size-4" />
            {label}
          </span>
          <span className="text-gray-300 text-sm font-medium">
            {userGames[key] || 0}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-gray-500 text-sm">
          <FaStar className="size-4" />
          Avaliações
        </span>
        <span className="text-gray-300 text-sm font-medium">
          {amountOfRatings}
        </span>
      </div>
    </div>
  )
}
