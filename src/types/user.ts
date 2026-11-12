export interface UserProfileResponse {
  user: User
}

export type XboxPreferredConsole = 'XBOX_ONE' | 'XBOX_SERIES'

export interface XboxAccount {
  id: string
  gamertag: string
  preferredConsole: XboxPreferredConsole | null
}

export interface SteamAccount {
  id: string
  steamId: string
  personaName: string
}

export interface PsnAccount {
  id: string
  onlineId: string
}

export interface User {
  id: string
  email: string
  emailVerified: boolean
  userName: string
  profilePicture: string
  userBanner: string
  gamesAmount: number
  totalHoursPlayed: number
  steamAccounts: SteamAccount[]
  psnAccounts: PsnAccount[]
  xboxAccounts: XboxAccount[]
  followersCount: number
  followingCount: number
}

export interface PublicUserProfile {
  id: string
  userName: string | null
  profilePicture: string | null
  userBanner: string | null
  gamesAmount: number
  totalHoursPlayed: number
  followersCount: number
  followingCount: number
}

export interface PublicUserProfileResponse {
  user: PublicUserProfile
}

export interface GameStatsResponse {
  playedCount: number
}

export interface GameHoursResponse {
  hoursPlayed: number
}

export interface GameCompletedAtResponse {
  completedAt: string | null
}

export interface UpdateUserProfileData {
  userName?: string
  profilePicture?: string | File
  userBanner?: string | File | null
}

type ReplaceFileWithString<T> = T extends File ? string : T

export type UpdateUserPayload = {
  [K in keyof UpdateUserProfileData]: ReplaceFileWithString<
    UpdateUserProfileData[K]
  >
}
