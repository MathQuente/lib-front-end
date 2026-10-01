import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { useGamePlatforms } from '../../hooks/useGamePlatforms'
import type { GameCardData } from '../../types/games'
import { getLibraryPlatform } from '../../utils/libraryPlatforms'
import { RatingAverage } from '../ratingAverage'
import { TotalsStrip, formatHours } from '../totalsGrid'

const SINGLE_PLATFORM_LABEL: Record<number, string> = {
  [STATUS.PLAYED]: 'Jogado em',
  [STATUS.PLAYING]: 'Jogando em',
  [STATUS.PAUSED]: 'Pausado em',
  [STATUS.BACKLOG]: 'Pretende jogar em',
}

export function LibraryStats({
  game,
  isPlayed,
  statusId,
}: {
  game: GameCardData
  isPlayed: boolean
  statusId?: number
}) {
  const igdbId = game.igdbId.toString()
  const { platforms, totals, isLoading } = useGamePlatforms(igdbId, true)

  if (isLoading) {
    return <div className="h-20 rounded-lg bg-dark-bg animate-pulse" />
  }

  const isSingle = platforms.length === 1
  const columns = Math.max(1, Math.min(platforms.length, 3))

  return (
    <div className="overflow-hidden rounded-lg border border-dark-border bg-dark-bg">
      {platforms.length === 0 ? (
        <p className="px-3 py-2 text-sm text-gray-400">
          Nenhuma plataforma registrada ainda.
        </p>
      ) : (
        <>
          <TotalsStrip
            hours={totals?.hoursPlayed ?? 0}
            completions={totals?.completions ?? 0}
            completedAt={totals?.completedAt}
            hideEmptyHours={!isPlayed}
            className="border-b border-dark-border"
          />

          <div className="flex">
            <span
              className="flex shrink-0 items-center self-stretch border-r border-dark-border px-3 text-xs text-gray-400"
              aria-hidden
            >
              {isSingle
                ? (SINGLE_PLATFORM_LABEL[statusId ?? STATUS.PLAYED] ??
                  'Jogado em')
                : 'Por plataforma'}
            </span>
            <ul
              aria-label={isSingle ? 'Plataforma' : 'Horas por plataforma'}
              className="grid min-w-0 flex-1"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {platforms.map((entry, index) => {
                const option = getLibraryPlatform(entry.platform)
                if (!option) return null
                const Icon = option.icon
                const hours = entry.hoursPlayed ?? 0
                const label = `${option.label}: ${formatHours(hours)}${
                  entry.completions > 1
                    ? `, zerado ${entry.completions} vezes`
                    : ''
                }`
                const borders = [
                  index % columns !== 0 ? 'border-l' : '',
                  index >= columns ? 'border-t' : '',
                ].join(' ')
                return (
                  <li
                    key={entry.platform}
                    title={option.label}
                    aria-label={label}
                    className={`flex items-center gap-1.5 border-dark-border px-3 py-1.5 text-xs ${borders}`}
                  >
                    <Icon
                      className="size-3.5 shrink-0 text-gray-300"
                      aria-hidden
                    />
                    {isSingle ? (
                      <span className="text-sm text-white">{option.label}</span>
                    ) : (
                      <span
                        className={`tabular-nums ${hours > 0 ? 'text-white' : 'text-gray-400'}`}
                      >
                        {formatHours(hours)}
                      </span>
                    )}
                    {!isSingle && entry.completions > 1 && (
                      <span className="tabular-nums text-primary-light">
                        {entry.completions}×
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}

      <div className="flex items-center gap-3 border-t border-dark-border px-3 py-1">
        <span className="text-xs text-gray-400">Sua nota</span>
        <RatingAverage game={game} isForGamePage />
      </div>
    </div>
  )
}
