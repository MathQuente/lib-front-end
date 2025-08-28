export enum GameStatusEnum {
  Played = "PLAYED",
  Playing = "PLAYING",
  Backlog = "BACKLOG",
  Wishlist = "WISHLIST",
}

export interface GameToDisplayResponse {
  game: Game;
  message: string;
}

export interface GamesFromHomePageResponse {
  mostRatedGames: Game[];
  trendingGames: Game[];
  recentGames: Game[];
  futureGames: Game[];
}

export interface SimilarGamesResponse {
  similarGames: Game[];
}

export type GameBase = Pick<
  Game,
  "id" | "gameBanner" | "gameName" | "isDlc" | "gameLaunchers" | "ratingAvg"
>;

export interface UserGamesResponse {
  games: {
    PLAYED: GameBase[];
    PLAYING: GameBase[];
    BACKLOG: GameBase[];
    WISHLIST: GameBase[];
  };
  totalPerStatus: TotalPerStatus[];
  totalGames: number;
}

export interface TotalPerStatus {
  status: string;
  totalGames: number;
}

export interface Game {
  id: string;
  gameName: string;
  gameBanner: string;
  gameStudios: GameStudio[];
  categories: Category[];
  publishers: Publisher[];
  platforms: Platform[];
  summary: string;
  gameLaunchers: GameLauncher[];
  isDlc: boolean;
  dlcs: Game[];
  parentGame: Game | null;
  ratings: {
    rating: number;
    count: number;
  }[];
  ratingAvg: number;
  amountOfRatings: number;
  userGames: {
    PLAYED: number;
    PLAYING: number;
    PAUSED: number;
    BACKLOCK: number;
    WISHLIST: number;
  };
  userWhoOwnThisGame: { userId: string }[];
}

export interface SimilarGame {
  id: string;
  gameBanner?: string;
  dlcBanner?: string;
}

export type GameStatus = {
  id: number;
  status: string;
};

export type GameStatusResponse = {
  userGameStatus: GameStatus;
};

export interface GameResponse {
  game: Game;
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface Platform {
  id: string;
  platformName: string;
}

export interface GameLauncher {
  dateRelease: string;
  platform: Platform;
}

export interface GameStudio {
  id: string;
  studioName: string;
}

export interface Publisher {
  id: string;
  publisherName: string;
}
