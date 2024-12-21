import type {
  Category,
  GameLauncher,
  GameStudio,
  Platform,
  Publisher
} from './games'

export interface UserGamesStatus {
  id: number
  status: string
}

// Interface específica para Game
interface Game extends UserGameDlcBase {
  type: 'game' // Tipo exclusivo para jogos
  UserGamesStatus: UserGamesStatus
}

// Interface específica para DLC
interface Dlc extends UserGameDlcBase {
  type: 'dlc' // Tipo exclusivo para DLCs
  UserGamesStatus: UserGamesStatus
  gameId: number // Referência ao jogo associado
}

export interface UserGameDlcBase {
  id: string
  name: string
  banner: string
  gameStudios: GameStudio[]
  categories: Category[]
  publishers: Publisher[]
  platforms: Platform[]
  summary: string
  gameLaunchers: GameLauncher[]
  type: 'game' | 'dlc' // Diferencia se é jogo ou DLC
  UserGamesStatus: UserGamesStatus
}

export type UserGameAndDlcResponse = (Game | Dlc)[]

export interface UserGamesResponse {
  userGames: UserGameAndDlcResponse
  totalPerStatus: TotalPerStatus[]
  totalGames: number
}

export interface TotalPerStatus {
  statusId: number
  totalGames: number
}

export interface UserProfileResponse {
  user: User
}

export interface User {
  id: string
  userName: string
  profilePicture: string
  userBanner: string
  gamesAmount: number
}

export interface GameStatus {
  id: number
  status: string
}
