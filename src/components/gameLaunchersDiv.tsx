import type { GameLauncher } from '../types/games'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

interface GameLaunchersDivProps {
  gameLaucher: GameLauncher
}

export function GameLaunchersDiv({ gameLaucher }: GameLaunchersDivProps) {
  return (
    <div
      key={gameLaucher.platform.id}
      className="flex items-center gap-1 px-2 py-2 bg-gray-700/50 rounded-lg transition-colors"
    >
      <span className="w-full flex gap-1">
        <p className="text-gray-300 md:text-sm lg:text-base">
          {gameLaucher.platform.platformName}:
        </p>

        <p className="text-gray-300">
          {dayjs(gameLaucher.dateRelease).format('DD/MM/YYYY')}
        </p>
      </span>
    </div>
  )
}
