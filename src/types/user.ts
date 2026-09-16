export interface UserProfileResponse {
  user: User
}

export interface User {
  id: string
  email: string
  userName: string
  profilePicture: string
  userBanner: string
  gamesAmount: number
  totalHoursPlayed: number
  steamId: string | null
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
