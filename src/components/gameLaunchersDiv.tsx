import type { GameLauncher } from '../types/games'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

interface GameLaunchersDivProps {
  gameLaucher: GameLauncher
}

export function GameLaunchersDiv({ gameLaucher }: GameLaunchersDivProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#25262F] border border-[#2A2B36] rounded-full text-sm">
      <span className="text-gray-500">
        {gameLaucher.platform.platformName}:
      </span>
      <span className="text-gray-300">
        {dayjs(gameLaucher.dateRelease).format('DD/MM/YYYY')}
      </span>
    </div>
  )
}
