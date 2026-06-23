export interface UserGame {
  igdbId: number
  name: string
  coverUrl: string | null
  platforms: string[]
  releaseDate: number | null
  rating: number
  status?: string
}

export interface TotalPerStatus {
  status: string
  totalGames: number
}

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

export interface GameStatus {
  id: number
  status: string
}

export interface GameStatsResponse {
  playedCount: number
}
