import { Crown, Plus } from 'lucide-react'
import type { GameResponse } from '../types/games'
import { Link } from 'react-router-dom'

interface DlcAndOriginalGameAreaProps {
  gameResponse: GameResponse
}

export function DlcAndOriginalGameArea({
  gameResponse
}: DlcAndOriginalGameAreaProps) {
  const { game } = gameResponse

  if (!game.isDlc && game.dlcs.length === 0) return null

  if (game.isDlc && game.parentGame) {
    return (
      <div className="bg-[#1F2029] border border-[#2A2B36] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-[#7A38CA] pl-3 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Crown className="size-3.5" />
          Jogo Original
        </h2>
        <Link
          to={`/games/${game.parentGame.id}`}
          className="flex items-center gap-4 p-3 bg-[#25262F] border border-[#2A2B36] rounded-lg hover:border-[#7A38CA]/50 transition-colors group"
        >
          <img
            src={game.parentGame.gameBanner}
            alt={game.parentGame.gameName}
            className="w-12 h-16 object-cover rounded flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate group-hover:text-[#9D52E8] transition-colors">
              {game.parentGame.gameName}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">Jogo base</p>
          </div>
        </Link>
      </div>
    )
  }

  if (game.dlcs.length > 0) {
    return (
      <div className="bg-[#1F2029] border border-[#2A2B36] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-[#7A38CA] pl-3 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Plus className="size-3.5" />
          DLCs Disponíveis
        </h2>
        <div className="flex flex-col gap-2">
          {game.dlcs.map(dlc => (
            <Link
              to={`/games/${dlc.id}`}
              key={dlc.id}
              className="flex items-center gap-4 p-3 bg-[#25262F] border border-[#2A2B36] rounded-lg hover:border-[#7A38CA]/50 transition-colors group"
            >
              <img
                src={dlc.gameBanner}
                alt={dlc.gameName}
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate group-hover:text-[#9D52E8] transition-colors">
                  {dlc.gameName}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Expansão</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return null
}
