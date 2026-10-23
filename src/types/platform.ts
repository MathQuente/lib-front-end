export type LibraryPlatform =
  | 'STEAM'
  | 'PLAYSTATION'
  | 'XBOX'
  | 'NINTENDO'
  | 'EPIC'
  | 'OTHER'

export type PlatformConsole =
  | 'UNKNOWN'
  | 'PS1'
  | 'PS2'
  | 'PS3'
  | 'PS4'
  | 'PS5'
  | 'PSP'
  | 'PS_VITA'
  | 'XBOX_ORIGINAL'
  | 'XBOX_360'
  | 'XBOX_ONE'
  | 'XBOX_SERIES'
  | 'NES'
  | 'SNES'
  | 'N64'
  | 'GAMECUBE'
  | 'WII'
  | 'WII_U'
  | 'SWITCH'
  | 'SWITCH_2'
  | 'GAME_BOY'
  | 'GAME_BOY_COLOR'
  | 'GAME_BOY_ADVANCE'
  | 'DS'
  | 'N3DS'
  | 'PC'
  | 'STEAM_DECK'
  | 'MASTER_SYSTEM'
  | 'MEGA_DRIVE'
  | 'SEGA_CD'
  | 'SATURN'
  | 'DREAMCAST'
  | 'GAME_GEAR'
  | 'ATARI_2600'
  | 'ATARI_7800'
  | 'NEO_GEO'
  | 'TURBOGRAFX'
  | 'MOBILE'
  | 'ARCADE'

export interface UserGamePlatformEntry {
  platform: LibraryPlatform
  console: PlatformConsole
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
