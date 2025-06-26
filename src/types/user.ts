import type {
  Category,
  Game,
  GameLauncher,
  GameStudio,
  Platform,
  Publisher
} from './games'

export interface UserGamesStatus {
  status: string
}

export interface UserGame {
  id: string
  gameName: string
  gameBanner: string
  gameStudios: GameStudio[]
  categories: Category[]
  publishers: Publisher[]
  platforms: Platform[]
  summary: string
  gameLaunchers: GameLauncher[]
  isDlc: boolean
  dlcs: Game[]
  parentGame: Game | null
  statuses?: string
}

export interface UserGamesResponse {
  userGames: UserGame[]
  totalPerStatus: TotalPerStatus[]
  totalGames: number
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
  userGameStats: {
    completions: number
  }
}

export interface RatingResponse {
  rating: number | null
}
