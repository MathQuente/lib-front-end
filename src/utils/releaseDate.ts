const DAY_MS = 86_400_000
const COUNTDOWN_MAX_DAYS = 30

const pad = (n: number) => String(n).padStart(2, '0')

function toDate(ts: number) {
  return new Date(ts * 1000)
}

export function formatReleaseDate(ts: number) {
  const d = toDate(ts)
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`
}

export function formatReleaseDayMonth(ts: number) {
  const d = toDate(ts)
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`
}

export function releaseYear(ts: number) {
  return toDate(ts).getUTCFullYear()
}

export function daysUntilRelease(ts: number, now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((ts * 1000 - today) / DAY_MS)
}

export function releaseCountdown(ts: number, now = new Date()) {
  const days = daysUntilRelease(ts, now)
  if (days < 0 || days > COUNTDOWN_MAX_DAYS) return null
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}
