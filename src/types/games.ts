export interface GamesResponse {
  gamesAndDlcs: GameAndDLC[]
  total: number
}

export interface SimilarGamesResponse {
  similarGames: SimilarGame[]
}

export interface SimilarGame {
  id: string
  gameBanner?: string
  dlcBanner?: string
}
export type GameAndDLC = {
  game?: Omit<Game, 'game'>
  dlc?: Omit<Dlc, 'dlc'>
}

export interface GameResponse {
  gameAndDlc: GameAndDLC
}

export interface GameStatusResponse {
  id: number
  status: string
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
  platforms: Platform
}

export interface GameStudio {
  id: string
  studioName: string
}

export interface Publisher {
  id: string
  publisherName: string
}
export interface Game {
  game: Game
  id: string
  gameName: string
  gameBanner: string
  summary: string
  categories: Category[]
  platforms: Platform[]
  publishers: Publisher[]
  gameStudios: GameStudio[]
  gameLaunchers: GameLauncher[]
  dlcs: Dlc[]
}

export interface Dlc {
  dlc: Dlc
  id: string
  dlcName: string
  dlcBanner: string
  summary: string
  categories: Category[]
  platforms: Platform[]
  publishers: Publisher[]
  gameStudios: GameStudio[]
  gameLaunchers: GameLauncher[]
  game: Game
}

export interface Games {
  games: Game[]
}
