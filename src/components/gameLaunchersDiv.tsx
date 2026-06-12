import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { GameLaunchersDivProps } from '../interfaces/games'

export function GameLaunchersDiv({ gameLaucher }: GameLaunchersDivProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm">
      <span className="text-gray-500">
        {gameLaucher.platform.platformName}:
      </span>
      <span className="text-gray-300">
        {dayjs(gameLaucher.dateRelease).format('DD/MM/YYYY')}
      </span>
    </div>
  )
}
