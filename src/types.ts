export interface Category {
  categoryName: string
}

export interface Platform {
  platformName: string
}

export interface GameLaunchers {
  dateRelease: string
  platforms: Platform
}

export interface GameStudio {
  studioName: string
}

export interface Game {
  id: string
  gameName: string
  gameBanner: string
  categories: Category[]
  platforms: Platform[]
  gameStudio: GameStudio
  gameLaunchers: GameLaunchers[]
}

export interface UserGame {
  game: Game
  id: string
  gameName: string
  gameBanner: string
  categories: Category[]
  platforms: Platform[]
  gameStudio: GameStudio
  gameLaunchers: GameLaunchers[]
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
