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

  if (!game.isDlc && game.dlcs.length === 0) {
    return (
      <div className="bg-[#272932]/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-200">
          <Plus className="w-6 h-6" />
          Avaliables DLCs
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400">Nenhuma expansão disponível</p>
          </div>
        </div>
      </div>
    )
  }

  if (game.isDlc && game.parentGame) {
    return (
      <div className="bg-[#272932]/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-200">
          <Crown className="w-6 h-6" />
          Original Game
        </h2>
        <div className="space-y-3">
          <Link
            to={`/games/${gameResponse.game.parentGame?.id}`}
            key={gameResponse?.game?.parentGame?.id}
            className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors cursor-pointer"
          >
            <img
              src={gameResponse?.game?.parentGame?.gameBanner}
              alt={`${gameResponse?.game?.parentGame?.gameBanner} banner`}
              className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center"
            />
            <div>
              <h3 className="font-semibold text-gray-200">
                {gameResponse?.game?.parentGame?.gameName}
              </h3>
              <p className="text-sm text-gray-400">Available Game</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  if (gameResponse.game.dlcs.length > 0) {
    return (
      <div className="bg-[#272932]/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-200">
          <Plus className="w-6 h-6" />
          Avaliables DLCs
        </h2>
        <div className="space-y-3">
          {gameResponse.game.dlcs.map(dlc => (
            <Link
              to={`/games/${dlc.id}`}
              key={dlc.id}
              className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors cursor-pointer"
            >
              <img
                src={dlc.gameBanner}
                alt={`${dlc.gameBanner} banner`}
                className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center"
              />

              <div>
                <h3 className="font-semibold text-gray-200">{dlc.gameName}</h3>
                <p className="text-sm text-gray-400">Expansão disponível</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return null
}
