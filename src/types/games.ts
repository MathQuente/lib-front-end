export enum GameStatusEnum {
  Finished = 1,
  Playing = 2,
  Replaying = 3,
  Backlog = 4,
  Wishlist = 5
}

export interface GamesResponse {
  games: Game[]
  total: number
}

export interface SimilarGamesResponse {
  similarGames: SimilarGame[]
}

export interface Game {
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
}

export interface SimilarGame {
  id: string
  gameBanner?: string
  dlcBanner?: string
}

export type GameStatus = {
  id: number
  status: string
}

export type GameStatusResponse = {
  userGameStatuses: GameStatus
}

export interface GameResponse {
  game: Game
}

export interface Category {
  id: number
  categoryName: string
}

export interface Platform {
  id: string
  platformName: string
}

export interface GameLauncher {
  dateRelease: string
  platform: Platform
}

export interface GameStudio {
  id: string
  studioName: string
}

export interface Publisher {
  id: string
  publisherName: string
}
