import type {
  Category,
  Dlc,
  Game,
  GameLauncher,
  GameStudio,
  Platform,
  Publisher
} from './games'

export interface UserGamesStatus {
  id: number
  status: string
}

// export type UserGameDlc = UserGame & Dlc

export type UserGameAndDlc = {
  game?: Omit<Game, 'game'>
  dlc?: Omit<Dlc, 'dlc'>
  UserGamesStatus: UserGamesStatus
}

export interface UserGamesResponse {
  userGames: UserGameAndDlc[]
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
  publishers: Publisher[]
  gameStudios: GameStudio[]
  gameLaunchers: GameLauncher[]
  dlcs: Dlc[]
  UserGamesStatus: UserGamesStatus
}

export interface GameStatus {
  id: number
  status: string
}

export interface UserGamesStatus {
  id: number
  status: string
}
