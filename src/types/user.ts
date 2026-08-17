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
}

export interface GameStatsResponse {
  playedCount: number
}

export interface UpdateUserProfileData {
  userName?: string
  profilePicture?: string | File
  userBanner?: string | File | null
}

type ReplaceFileWithString<T> = T extends File ? string : T

// The API only accepts URLs — files are uploaded separately and swapped for
// their resulting URL before the request is built (see useUserProfile.ts).
export type UpdateUserPayload = {
  [K in keyof UpdateUserProfileData]: ReplaceFileWithString<
    UpdateUserProfileData[K]
  >
}
