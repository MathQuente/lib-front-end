export const USER_GAME_STATUS_ID = {
  PLAYED: 1,
  PAUSED: 2,
  PLAYING: 3,
  BACKLOG: 4,
  WISHLIST: 5,
  DROPPED: 6
} as const

export const REVIEW_ELIGIBLE_STATUS_IDS: number[] = [
  USER_GAME_STATUS_ID.PLAYED,
  USER_GAME_STATUS_ID.PLAYING,
  USER_GAME_STATUS_ID.PAUSED,
  USER_GAME_STATUS_ID.DROPPED
]

export const REVIEW_STATUS_LABEL: Record<string, string> = {
  PLAYED: 'Jogado',
  PLAYING: 'Jogando',
  PAUSED: 'Pausado',
  DROPPED: 'Larguei'
}
