export type LibraryPlatform =
  | 'STEAM'
  | 'PLAYSTATION'
  | 'XBOX'
  | 'NINTENDO'
  | 'EPIC'
  | 'OTHER'

export interface UserGamePlatformEntry {
  platform: LibraryPlatform
  hoursPlayed: number | null
  completions: number
  completedAt: string | null
}

export interface UserGamePlatformsResponse {
  platforms: UserGamePlatformEntry[]
  totals: {
    hoursPlayed: number
    completions: number
    completedAt: string | null
  }
}

export interface UserGamePlatformPatch {
  hoursPlayed?: number | null
  completions?: number
  completedAt?: string | null
}
