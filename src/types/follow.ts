export interface FollowSummary {
  id: string
  userName: string | null
  profilePicture: string | null
}

export interface IsFollowingResponse {
  isFollowing: boolean
}

export interface GetFollowersResponse {
  followers: FollowSummary[]
}

export interface GetFollowingResponse {
  following: FollowSummary[]
}

export interface UserSearchResult {
  id: string
  userName: string | null
  profilePicture: string | null
  userBanner: string | null
  userGamesAmount: number
}

export interface SearchUsersResponse {
  users: UserSearchResult[]
}
