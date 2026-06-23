export enum GameStatusEnum {
  Played = 'PLAYED',
  Playing = 'PLAYING',
  Backlog = 'BACKLOG',
  Wishlist = 'WISHLIST'
}

export interface GameBase {
  igdbId: number
  name: string
  coverUrl: string | null
  platforms: string[]
  releaseDate: number | null
  rating: number
  genres: string[]
  summary: string
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
}

export interface UserGameEntry extends GameBase {
  status: { id: number; name: string }
}

export interface UserGamesResponse {
  userGames: UserGameEntry[]
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
}
