import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import type {
  Game,
  GameBase,
  GameLauncher,
  GameResponse,
  GameStatusEnum,
  SimilarGamesResponse,
  UserGamesResponse
} from '../types/games'
import type { UseGamesProps } from '../hooks/useGames'

export type SortField = 'gameName' | 'dateRelease' | 'rating'
export type SortOrder = 'asc' | 'desc'
export type SectionType = 'coming' | 'trending' | 'rateds'

export interface GameCardProps {
  game: GameBase
  className?: string
  size?: 'small' | 'medium' | 'larger'
  enableModal?: boolean
}

export interface GameInfoProps {
  game: GameBase | undefined
  onClose: () => void
}

export interface GamesGridProps {
  games: GameBase[]
  emptyState?: ReactNode
  className?: string
}

export interface GameListProps {
  games: UseGamesProps | UserGamesResponse
  page: number
  setPage: (page: number) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  sortField: SortField
  setSortField: (field: SortField) => void
  filterField?: GameStatusEnum
  setFilterField?: (filterField: GameStatusEnum) => void
  currentStatus?: string
  onFilterChange?: (filter: GameStatusEnum | '') => void
  isUserLibrary?: boolean
  emptyState?: ReactNode
}

export interface GameListSectionProps extends ComponentProps<'div'> {
  games: Game[]
  title: string
  type: SectionType
}

export interface SimilarGamesSliderProps {
  SimilarGames: SimilarGamesResponse
}

export interface RatingAverageProps {
  game: GameBase | undefined
  isForGamePage?: boolean
  justAverage?: boolean
}

export interface RatingChartProps {
  GameResponse: GameResponse
}

export interface DetailsProps {
  GameResponse: GameResponse
}

export interface DlcAndOriginalGameAreaProps {
  gameResponse: GameResponse
}

export interface PlatformDivProps {
  platformName: string
}

export interface CategoriesDivProps {
  categoryName: string
}

export interface GameLaunchersDivProps {
  gameLaucher: GameLauncher
}

export interface PlayerInfosProps {
  GameResponse: GameResponse
}

export interface SortControlsProps {
  sortField: SortField
  sortOrder: SortOrder
  filterField: GameStatusEnum | undefined
  onSortFieldChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onSortOrderChange: (order: SortOrder) => void
  onSortFilterField: (event: ChangeEvent<HTMLSelectElement>) => void
  totalGames: number
  isUserLibrary?: boolean
}
