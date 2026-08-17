import dayjs from 'dayjs'
import type { GameLaunchersDivProps } from '../interfaces/games'

export function GameLaunchersDiv({ platformName, date }: GameLaunchersDivProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm">
      <span className="text-gray-500">{platformName}:</span>
      <span className="text-gray-300">
        {date ? dayjs.unix(date).format('DD/MM/YYYY') : 'Data desconhecida'}
      </span>
    </div>
  )
}
