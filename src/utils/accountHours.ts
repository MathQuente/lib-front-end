import { formatHours } from '../components/totalsGrid'
import type { UserGamePlatformEntry } from '../types/platform'

export function hasAccountBreakdown(entry: UserGamePlatformEntry) {
  return entry.hoursPlayed !== null && entry.accountHours.length > 1
}

export function accountHoursText(entry: UserGamePlatformEntry) {
  return entry.accountHours
    .map(account => `${account.gamertag} ${formatHours(account.hoursPlayed)}`)
    .join(' · ')
}

export function hasNoHours(entries: UserGamePlatformEntry[]) {
  return (
    entries.length > 0 && entries.every(entry => entry.hoursPlayed === null)
  )
}
