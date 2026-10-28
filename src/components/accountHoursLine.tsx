import type { UserGamePlatformEntry } from '../types/platform'
import { hasAccountBreakdown } from '../utils/accountHours'
import { formatHours } from './totalsGrid'

export function AccountHoursLine({
  entry,
  label,
}: {
  entry: UserGamePlatformEntry
  label?: string
}) {
  if (!hasAccountBreakdown(entry)) return null

  const list = (
    <ul
      aria-label={label ? `Horas por conta em ${label}` : 'Horas por conta'}
      className="flex flex-wrap gap-x-3.5 gap-y-0.5 text-xs text-gray-400"
    >
      {entry.accountHours.map((account, index) => (
        <li key={`${account.gamertag}-${index}`} className="flex flex-wrap gap-x-1.5">
          <span className="break-all text-gray-200">{account.gamertag}</span>
          <span className="font-display font-bold text-white tabular-nums">
            {formatHours(account.hoursPlayed)}
          </span>
        </li>
      ))}
    </ul>
  )

  if (!label) return list

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-gray-400">
      <span aria-hidden="true">{label}:</span>
      {list}
    </div>
  )
}
