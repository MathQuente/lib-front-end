import type { TotalPerStatus, UserGamesByStatus } from '../types/games'

export interface UserGameDivProps {
  Games: UserGamesByStatus
  totalPerStatus: TotalPerStatus[]
  showAllLink?: boolean
}

export type UserGamesFormProps = {
  afterSave: () => void
  onCancel?: () => void
}
