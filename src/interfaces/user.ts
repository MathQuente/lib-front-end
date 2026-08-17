import type { TotalPerStatus, UserGamesByStatus } from '../types/games'

export interface UserGameDivProps {
  Games: UserGamesByStatus
  totalPerStatus: TotalPerStatus[]
}

export type UserGamesFormProps = {
  afterSave: () => void
  onCancel?: () => void
}
