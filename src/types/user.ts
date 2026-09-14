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
  isPublic: boolean
}

export interface PublicUserProfile {
  id: string
  userName: string | null
  isPublic: boolean
  profilePicture: string | null
  userBanner: string | null
  gamesAmount?: number
  totalHoursPlayed?: number
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
  isPublic?: boolean
}

type ReplaceFileWithString<T> = T extends File ? string : T

export type UpdateUserPayload = {
  [K in keyof UpdateUserProfileData]: ReplaceFileWithString<
    UpdateUserProfileData[K]
  >
}
