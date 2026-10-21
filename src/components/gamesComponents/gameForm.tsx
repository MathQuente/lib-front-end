import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { endlessControl } from '../../utils/endlessAvailability'
import { useGamePlatforms } from '../../hooks/useGamePlatforms'
import { useGameStatus } from '../../hooks/useGameStatus'
import type { GameFormProps } from '../../interfaces/games'
import { GamePlatformsSection } from '../gamePlatformsSection'
import { LibraryRecordFields } from '../libraryRecordFields'
import { EndlessToggle } from '../endlessToggle'
import { GameStatusButtons } from './gameStatusButtons'

export function GameForm({ game }: GameFormProps) {
  const igdbId = game?.igdbId?.toString()
  const { gameStatus } = useGameStatus(igdbId)

  const activeStatus = gameStatus?.userGameStatus
  const hasStatus = (statusId: number) => activeStatus?.id === statusId
  const canHavePlatforms = !!activeStatus && activeStatus.id !== STATUS.WISHLIST

  const {
    platforms,
    totals,
    addPlatform,
    updatePlatform,
    removePlatform,
    isMutating,
  } = useGamePlatforms(igdbId ?? '', canHavePlatforms)

  if (!game) return null

  const usesPlatforms = canHavePlatforms && platforms.length > 0
  const isUpcoming = game.releaseDate ? game.releaseDate * 1000 > Date.now() : false
  const endless = endlessControl(activeStatus?.id, isUpcoming)

  return (
    <div className="flex flex-col gap-3 w-full">
      <GameStatusButtons game={game} />

      {endless.show && (
        <EndlessToggle
          igdbId={game.igdbId.toString()}
          disabledReason={endless.disabledReason}
        />
      )}

      {canHavePlatforms && (
        <GamePlatformsSection
          gamePlatforms={game.platforms}
          platforms={platforms}
          totalHours={totals?.hoursPlayed ?? 0}
          totalCompletions={totals?.completions ?? 0}
          totalCompletedAt={totals?.completedAt}
          isPlayed={hasStatus(STATUS.PLAYED)}
          statusId={activeStatus?.id}
          disabled={isMutating}
          onAdd={addPlatform}
          onUpdate={updatePlatform}
          onRemove={removePlatform}
        />
      )}

      {!usesPlatforms && canHavePlatforms && (
        <LibraryRecordFields game={game} isPlayed={hasStatus(STATUS.PLAYED)} />
      )}
    </div>
  )
}
