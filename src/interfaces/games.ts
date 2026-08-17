import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import type {
  Game,
  GameBase,
  GameCardData,
  GameListData,
  GameResponse,
  GameStatusEnum,
  SimilarGamesResponse
} from '../types/games'

export type SortField = 'name' | 'releaseDate' | 'rating'
export type SortOrder = 'asc' | 'desc'
export type SectionType = 'coming' | 'trending' | 'rateds'

export interface GameCardProps {
  game: GameCardData
  className?: string
  size?: 'small' | 'medium' | 'larger'
  enableModal?: boolean
}

export interface GameFormProps {
  game: GameCardData | undefined
}

export interface GameInfoProps {
  game: GameCardData | undefined
  onClose: () => void
}

export interface GamesGridProps {
  games: GameCardData[]
  emptyState?: ReactNode
  className?: string
}

export interface GameListProps {
  games: GameListData
  page: number
  pageSize?: number
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
  games: GameBase[]
  title: string
  type: SectionType
}

export interface SimilarGamesSliderProps {
  SimilarGames: SimilarGamesResponse
}

export interface RelatedGamesSliderProps {
  relatedGames: GameBase[]
}

export interface DlcAndOriginalGameAreaProps {
  game: Game
  relatedGames: GameBase[]
}

export interface GameLaunchersDivProps {
  platformName: string
  date: number | null
}

export interface RatingAverageProps {
  game: GameCardData | undefined
  isForGamePage?: boolean
  justAverage?: boolean
}

export interface RatingChartProps {
  GameResponse: GameResponse
}

export interface DetailsProps {
  GameResponse: GameResponse
}

export interface PlatformDivProps {
  platformName: string
}

export interface CategoriesDivProps {
  categoryName: string
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

