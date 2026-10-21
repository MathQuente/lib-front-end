import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'

export type EndlessControl =
  | { show: false }
  | { show: true; disabledReason: string | null }

// Em Jogando, Pausado e Largado a flag é editável. Em Jogado o controle aparece travado,
// porque a flag pode ter ficado ligada de antes. Em Na fila, Lista de desejos e jogo não
// lançado ela não faz sentido, então o controle não aparece.
export function endlessControl(
  statusId: number | undefined,
  isUpcoming: boolean
): EndlessControl {
  if (statusId == null || isUpcoming) return { show: false }
  if (statusId === STATUS.BACKLOG || statusId === STATUS.WISHLIST)
    return { show: false }
  if (statusId === STATUS.PLAYED)
    return {
      show: true,
      disabledReason:
        'Só vale para jogos que você está jogando, pausou ou largou.'
    }
  return { show: true, disabledReason: null }
}
