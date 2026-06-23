import { Gamepad2, Play, Library, Gift, Star } from 'lucide-react'
import type { PlayerInfosProps } from '../interfaces/games'

const rows = [
  { icon: Gamepad2, label: 'Jogado', key: 'PLAYED' },
  { icon: Play, label: 'Jogando', key: 'PLAYING' },
  { icon: Library, label: 'Backlog', key: 'BACKLOG' },
  { icon: Gift, label: 'Lista de Desejos', key: 'WISHLIST' }
] as const

export function PlayersInfo({ GameResponse }: PlayerInfosProps) {
  const { userGames, amountOfRatings } = GameResponse.game

  if (!userGames) return null

  return (
    <div className="flex flex-col gap-1 py-2 border-t border-dark-border">
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
          <Star className="size-4" />
          Avaliações
        </span>
        <span className="text-gray-300 text-sm font-medium">
          {amountOfRatings ?? '—'}
        </span>
      </div>
    </div>
  )
}
