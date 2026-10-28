import dayjs from 'dayjs'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { useCompletedAt } from '../../hooks/useCompletedAt'
import { useGamePlatforms } from '../../hooks/useGamePlatforms'
import { useHoursPlayed } from '../../hooks/useHoursPlayed'
import { usePlayedCount } from '../../hooks/usePlayedCount'
import { useRating } from '../../hooks/useRating'
import type { GameCardData } from '../../types/games'
import { getLibraryPlatform } from '../../utils/libraryPlatforms'
import { hasAccountBreakdown, hasNoHours } from '../../utils/accountHours'
import { entryDisplayName, entryKey } from '../../utils/platformConsoles'
import { focusRing } from '../../styles/focus'
import { AccountHoursLine } from '../accountHoursLine'
import { RatingAverage } from '../ratingAverage'
import { NO_HOURS_LABEL, formatHours } from '../totalsGrid'

const SINGLE_PLATFORM_LABEL: Record<number, string> = {
  [STATUS.PLAYED]: 'Jogado em',
  [STATUS.PLAYING]: 'Jogando em',
  [STATUS.PAUSED]: 'Pausado em',
  [STATUS.BACKLOG]: 'Pretende jogar em',
  [STATUS.DROPPED]: 'Jogava em',
}

const MAX_PLATFORMS_IN_MODAL = 2

const valueClass = 'font-display text-[15px] font-extrabold tabular-nums'

function totalItems(
  hours: number,
  completions: number,
  completedAt: string | null | undefined,
  isPlayed: boolean,
  noHours: boolean
): ReactNode[] {
  const items: ReactNode[] = []
  if (hours > 0 || isPlayed) {
    items.push(
      noHours ? (
        <span key="hours">{NO_HOURS_LABEL}</span>
      ) : (
        <span key="hours">
          <span className={`${valueClass} text-primary-light`}>
            {formatHours(hours)}
          </span>{' '}
          jogadas
        </span>
      )
    )
  }
  if (completions > 0) {
    items.push(
      <span key="completions">
        zerado{' '}
        <span className={`${valueClass} text-white`}>{completions}</span>{' '}
        <span className="text-gray-200">
          {completions === 1 ? 'vez' : 'vezes'}
        </span>
      </span>
    )
  }
  if (completedAt) {
    items.push(
      <span key="completedAt">
        finalizado em{' '}
        <span className={`${valueClass} text-white`}>
          {dayjs(completedAt).format('DD/MM/YYYY')}
        </span>
      </span>
    )
  }
  return items
}

function MetaLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] text-gray-400">
      {children}
    </div>
  )
}

export function LibraryStats({
  game,
  isPlayed,
  statusId,
  onSeeDetails,
}: {
  game: GameCardData
  isPlayed: boolean
  statusId?: number
  onSeeDetails?: () => void
}) {
  const igdbId = game.igdbId.toString()
  const { platforms, totals, isLoading } = useGamePlatforms(igdbId, true)
  const { hoursPlayed } = useHoursPlayed(igdbId)
  const { completions } = usePlayedCount(igdbId)
  const { completedAt } = useCompletedAt(igdbId)
  const { userRating, isLoading: ratingIsLoading } = useRating(igdbId)
  const hasRecord = hoursPlayed > 0 || completions > 0

  if (isLoading) {
    return <div className="h-20 rounded-lg bg-dark-bg animate-pulse" />
  }

  const isSingle = platforms.length === 1
  const uniquePlatforms = platforms.filter(
    (entry, index) =>
      platforms.findIndex(other => other.platform === entry.platform) === index
  )
  const totalsOfPlatforms = totalItems(
    totals?.hoursPlayed ?? 0,
    totals?.completions ?? 0,
    totals?.completedAt,
    isPlayed,
    hasNoHours(platforms)
  )

  const isReleased = game.releaseDate
    ? new Date() > new Date(game.releaseDate * 1000)
    : false
  const ratingLabel =
    isReleased && !ratingIsLoading && userRating == null
      ? 'Dê uma nota'
      : 'Sua nota'
  const showRatingValue = isReleased && userRating != null

  const singleOption = isSingle ? getLibraryPlatform(platforms[0].platform) : undefined
  const SingleIcon = singleOption?.icon
  const singleName =
    singleOption && isSingle
      ? entryDisplayName(platforms[0], singleOption.label)
      : ''

  return (
    <div className="flex flex-col gap-1">
      {platforms.length === 0 && hasRecord ? (
        <MetaLine>
          {totalItems(
            hoursPlayed,
            completions,
            completions > 0 ? completedAt : null,
            isPlayed,
            false
          )}
        </MetaLine>
      ) : platforms.length === 0 ? (
        <p className="text-sm text-gray-400">
          Nenhuma plataforma registrada ainda.
        </p>
      ) : isSingle ? (
        <>
          <MetaLine>
            {singleOption && SingleIcon && (
              <span className="inline-flex items-center gap-1.5">
                {SINGLE_PLATFORM_LABEL[statusId ?? STATUS.PLAYED] ??
                  'Jogado em'}
                <SingleIcon
                  className="size-3.5 shrink-0 text-gray-300"
                  aria-hidden
                />
                <span className="font-medium text-gray-100">{singleName}</span>
              </span>
            )}
            {totalsOfPlatforms}
          </MetaLine>
          <AccountHoursLine entry={platforms[0]} />
        </>
      ) : platforms.length > MAX_PLATFORMS_IN_MODAL ? (
        <>
          {totalsOfPlatforms.length > 0 && (
            <MetaLine>{totalsOfPlatforms}</MetaLine>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              {uniquePlatforms.map(entry => {
                const option = getLibraryPlatform(entry.platform)
                if (!option) return null
                const Icon = option.icon
                return (
                  <Icon
                    key={entry.platform}
                    className="size-3.5 shrink-0 text-gray-300"
                    aria-hidden
                  />
                )
              })}
              <span>
                {uniquePlatforms.length === platforms.length
                  ? `${platforms.length} plataformas`
                  : `${platforms.length} plataformas e consoles`}
              </span>
              <span className="sr-only">
                {platforms
                  .map(entry => {
                    const base = getLibraryPlatform(entry.platform)?.label
                    return base ? entryDisplayName(entry, base) : undefined
                  })
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </span>
            {onSeeDetails && (
              <button
                type="button"
                onClick={onSeeDetails}
                className={`-my-2 inline-flex min-h-11 items-center gap-0.5 rounded-sm font-medium text-primary-light hover:text-white ${focusRing}`}
              >
                Ver horas por plataforma
                <ChevronRight className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {totalsOfPlatforms.length > 0 && (
            <MetaLine>{totalsOfPlatforms}</MetaLine>
          )}
          <p className="-mb-0.5 text-xs text-gray-400" aria-hidden="true">
            Por plataforma
          </p>
          <ul
            aria-label="Horas por plataforma"
            className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-gray-400"
          >
            {platforms.map(entry => {
              const option = getLibraryPlatform(entry.platform)
              if (!option) return null
              const Icon = option.icon
              const hours = entry.hoursPlayed ?? 0
              const hoursText =
                entry.hoursPlayed === null ? NO_HOURS_LABEL : formatHours(hours)
              const name = entryDisplayName(entry, option.label)
              const label = `${name}: ${hoursText}${
                entry.completions > 1
                  ? `, zerado ${entry.completions} vezes`
                  : ''
              }`
              return (
                <li
                  key={entryKey(entry)}
                  aria-label={label}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Icon className="size-3.5 shrink-0 text-gray-300" aria-hidden />
                  <span className="text-gray-200">{name}</span>
                  <span
                    className={
                      entry.hoursPlayed === null
                        ? 'text-gray-400'
                        : `${valueClass} ${hours > 0 ? 'text-white' : 'text-gray-400'}`
                    }
                  >
                    {hoursText}
                  </span>
                  {entry.completions > 1 && (
                    <span>zerado {entry.completions} vezes</span>
                  )}
                </li>
              )
            })}
          </ul>
          {platforms.filter(hasAccountBreakdown).map(entry => {
            const option = getLibraryPlatform(entry.platform)
            if (!option) return null
            return (
              <AccountHoursLine
                key={entryKey(entry)}
                entry={entry}
                label={entryDisplayName(entry, option.label)}
              />
            )
          })}
        </>
      )}

      <div className="flex min-h-11 items-center gap-3">
        <span className="text-xs text-gray-400">
          {ratingLabel}
          {showRatingValue && (
            <>
              {' '}
              <span className={`${valueClass} text-primary-light`}>
                {userRating}
              </span>
            </>
          )}
        </span>
        <RatingAverage game={game} isForGamePage />
      </div>
    </div>
  )
}
