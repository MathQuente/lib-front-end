import type { GameBase } from '../types/games'
import type { TotalPerStatus } from '../types/user'

export type UserStatus = 'BACKLOG' | 'PLAYED' | 'PLAYING' | 'WISHLIST'

export interface UserGameDivProps {
  Games: Record<UserStatus, GameBase[]>
  totalPerStatus: TotalPerStatus[]
}

export type UserGamesFormProps = {
  afterSave: () => void
  onCancel?: () => void
}
