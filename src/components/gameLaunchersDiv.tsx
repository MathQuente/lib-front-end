import type { GameLauncher } from '../types/games'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { CiCalendar } from 'react-icons/ci'

interface GameLaunchersDivProps {
  gameLaucher: GameLauncher
}

export function GameLaunchersDiv({ gameLaucher }: GameLaunchersDivProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-2 flex flex-row items-center justify-center gap-2">
      <p className="text-slate-400 text-xl font-normal">
        {gameLaucher.platform.platformName}:
      </p>
      <div className="flex flex-row items-center justify-center gap-1">
        <p className="text-slate-400 text-xl font-normal">
          <CiCalendar className="size-5" />
        </p>
        <p className="text-slate-400 text-xl font-normal">
          {dayjs(gameLaucher.dateRelease).format('DD/MM/YYYY')}
        </p>
      </div>
    </div>
  )
}
