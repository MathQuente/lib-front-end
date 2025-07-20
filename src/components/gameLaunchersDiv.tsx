import type { GameLauncher } from '../types/games'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { Download } from 'lucide-react'

interface GameLaunchersDivProps {
  gameLaucher: GameLauncher
}

export function GameLaunchersDiv({ gameLaucher }: GameLaunchersDivProps) {
  return (
    <button
      type="button"
      key={gameLaucher.platform.id}
      className="w-full flex items-center gap-3 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
    >
      <Download className="w-4 h-4" />
      <span className="w-full flex gap-1">
        <p>{dayjs(gameLaucher.dateRelease).format('DD/MM/YYYY')}</p>
        <p>on {gameLaucher.platform.platformName}</p>
      </span>
    </button>
  )
}
