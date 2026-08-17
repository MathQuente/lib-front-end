export enum GameStatusEnum {
  Played = 'PLAYED',
  Playing = 'PLAYING',
  Paused = 'PAUSED',
  Backlog = 'BACKLOG',
  Wishlist = 'WISHLIST'
}

export interface GameCardData {
  igdbId: number
  name: string
  coverUrl: string | null
  releaseDate?: number | null
  summary?: string
  category?: number
  parentGameId?: number | null
}

export interface GameBase extends GameCardData {
  platforms: string[]
  releaseDate: number | null
  rating: number | null
  genres: string[]
  summary: string
  category: number
  parentGameId: number | null
}

export interface GameReleaseDate {
  platformName: string
  date: number | null
}

export interface Game extends GameBase {
  developers?: string[]
  publishers?: string[]
  userGames?: {
    PLAYED: number
    PLAYING: number
    PAUSED: number
    BACKLOG: number
    WISHLIST: number
  }
  amountOfRatings?: number
  parentGame?: GameCardData
  releaseDates?: GameReleaseDate[]
}

export interface UserGameEntry extends GameCardData {
  platforms?: string[]
  releaseDate?: number
  rating: number | null
  status: string
}

export type UserGamesByStatus = Record<GameStatusEnum, UserGameEntry[]>

export interface UserGamesResponse {
  games: UserGamesByStatus
  totalPerStatus: TotalPerStatus[]
  total: number
}

export interface UseGamesProps {
  games: GameBase[]
  total: number
}

export interface GameListData {
  games: GameCardData[]
  total: number
}

export interface TotalPerStatus {
  status: string
  totalGames: number
}

export interface GameToDisplayResponse {
  game: { igdbId: number; name: string; coverUrl: string | null } | null
  message: string
}

export interface GamesFromHomePageResponse {
  mostRatedGames: GameBase[]
  trendingGames: GameBase[]
  recentGames: GameBase[]
  futureGames: GameBase[]
}

export interface SimilarGamesResponse {
  similarGames: GameBase[]
}

export type GameStatus = {
  id: number
  status: string
}

export type GameStatusResponse = {
  userGameStatus: GameStatus
}

export interface GameResponse {
  game: Game
  relatedGames: GameBase[]
}
