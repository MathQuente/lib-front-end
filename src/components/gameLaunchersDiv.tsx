import dayjs from 'dayjs'
import type { GameLaunchersDivProps } from '../interfaces/games'
import { getPlatformIcon } from '../utils/platformIcon'

export function GameLaunchersDiv({ platformName, date }: GameLaunchersDivProps) {
  const Icon = getPlatformIcon(platformName)

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm">
      <Icon className="size-4 text-gray-400 flex-shrink-0" />
      <span className="text-gray-400">{platformName}:</span>
      <span className="text-gray-300">
        {date ? dayjs.unix(date).format('DD/MM/YYYY') : 'Data desconhecida'}
      </span>
    </div>
  )
}
