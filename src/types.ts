interface Category {
  categoryName: string
}

interface Platform {
  platformName: string
}

interface GameLaunchers {
  dateRelease: string
  platforms: Platform
}

interface GameStudio {
  studioName: string
}

interface Publisher {
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

interface UserGamesStatus {
  id: number
  status: string
}

export interface User {
  id: string
  userName: string
  profilePicture: string
  userBanner: string | undefined
}
