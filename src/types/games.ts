export interface GamesResponse {
  games: GameDlcResponse
  total: number
}

export interface SimilarGamesResponse {
  similarGames: SimilarGame[]
}

export interface GameDlcBase {
  id: string
  name: string
  banner: string
  gameStudios: GameStudio[]
  categories: Category[]
  publishers: Publisher[]
  platforms: Platform[]
  summary: string
  game?: Game
  dlcs?: Dlc[]
  gameLaunchers: GameLauncher[]
  type: 'game' | 'dlc' // Diferencia se é jogo ou DLC
}

export enum GameStatusEnum {
  Finished = 1,
  Playing = 2,
  Paused = 3
}

// Interface específica para Game
interface Game extends GameDlcBase {
  type: 'game' // Tipo exclusivo para jogos
  dlcs: Dlc[]
}

// Interface específica para DLC
interface Dlc extends GameDlcBase {
  type: 'dlc' // Tipo exclusivo para DLCs
  game: Game
}

// Tipagem do array de jogos e DLCs combinados
export type GameDlcResponse = (Game | Dlc)[]

export interface SimilarGame {
  id: string
  gameBanner?: string
  dlcBanner?: string
}

export type GameStatusResponse = {
  id: number
  status: string
}

export interface GameResponse {
  gameAndDlc: GameDlcBase
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
