export interface GamesResponse {
  games: Game[]
  total: number
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

export interface GameLaunchers {
  dateRelease: string
  platforms: Platform
}

export interface GameStudio {
  studioName: string
}

export interface Publisher {
  publisherName: string
}
export interface Game {
  game: Game
  id: string
  gameName: string
  gameBanner: string
  categories: Category[]
  platforms: Platform[]
  publisher: Publisher
  gameStudio: GameStudio
  gameLaunchers: GameLaunchers[]
}
export interface Games {
  games: Game[]
}
