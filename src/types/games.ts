export enum GameStatusEnum {
  Played = 'PLAYED',
  Playing = 'PLAYING',
  Backlog = 'BACKLOG',
  Wishlist = 'WISHLIST'
}

export interface GamesResponse {
  games: Game[]
  total: number
}

export interface GamesFromHomePageResponse {
  mostBeateds: Game[]
  gamesTrending: Game[]
  recentGames: Game[]
  futureGames: Game[]
}

export interface SimilarGamesResponse {
  similarGames: Game[]
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
  ratingAvrg: number
  ratings: {
    value: number
    _count: {
      value: number
    }
  }[]
  totalOfRating: {
    value: number
  }
  userGames: {
    PLAYED: number
    PLAYING: number
    PAUSED: number
    BACKLOCK: number
    WISHLIST: number
  }
  userWhoOwnThisGame: { userId: string }[]
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

export interface RatingsResponse {
  ratings: {
    value: number
    _count: {
      value: number
    }
  }[]
}
