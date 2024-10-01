import type {
  Category,
  Game,
  GameLaunchers,
  GameStudio,
  Platform,
  Publisher
} from './games'

export interface UserGamesStatus {
  id: number
  status: string
}

export interface UserGamesResponse {
  userGames: UserGame[]
  totalPerStatus: TotalPerStatus[]
  totalGames: number
}

export interface TotalPerStatus {
  statusId: number
  totalGames: number
}

export interface UserProfileResponse {
  user: User
  total: number
}

export interface User {
  id: string
  userName: string
  profilePicture: string
  userBanner: string
}

export interface UserGames {
  userGames: UserGame[]
}

export interface UserGame {
  game: Game
  id: string
  gameName: string
  gameBanner: string
  categories: Category[]
  platforms: Platform[]
  publisher: Publisher
  gameStudio: GameStudio
  gameLaunchers: GameLaunchers[]
  UserGamesStatus: UserGamesStatus
}

export interface GameStatus {
  id: number
  status: string
}
