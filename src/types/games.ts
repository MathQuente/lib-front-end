export enum GameStatusEnum {
  Played = 'PLAYED',
  Playing = 'PLAYING',
  Paused = 'PAUSED',
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
  category: number
  parentGameId: number | null
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

export interface UserGameEntry {
  igdbId: number
  name: string
  coverUrl: string | null
  platforms?: string[]
  releaseDate?: number
  siteRating: number | null
  status: string
}

export interface UserGamesResponse {
  games: {
    PLAYED: UserGameEntry[]
    PLAYING: UserGameEntry[]
    PAUSED: UserGameEntry[]
    BACKLOG: UserGameEntry[]
    WISHLIST: UserGameEntry[]
  }
  totalPerStatus: TotalPerStatus[]
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
