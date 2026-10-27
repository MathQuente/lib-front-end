import {
  REVIEW_ELIGIBLE_STATUS_IDS,
  USER_GAME_STATUS_ID as STATUS
} from '../constants/gameStatus'
import { useGameStatus } from './useGameStatus'
import { useHoursPlayed } from './useHoursPlayed'
import { usePlayedCount } from './usePlayedCount'
import { useReview } from './useReview'

export type ReviewBlockedReason = 'unreleased' | 'status'

export function useReviewPermission(
  igdbId: string,
  releaseDate?: number | null
) {
  const { gameStatus, isLoadingStatus } = useGameStatus(igdbId)
  const { review, isLoading: isReviewLoading } = useReview(igdbId)
  const { hoursPlayed, isFetchingHours } = useHoursPlayed(igdbId)
  const { completions, isFetchingCompletions } = usePlayedCount(igdbId)

  const statusId = gameStatus?.userGameStatus?.id
  const inLibrary = statusId != null
  const inBacklog = statusId === STATUS.BACKLOG
  const isReleased = releaseDate ? Date.now() > releaseDate * 1000 : true
  const hasExperience = hoursPlayed > 0 || completions > 0

  const isEligible =
    (statusId != null && REVIEW_ELIGIBLE_STATUS_IDS.includes(statusId)) ||
    (inBacklog && hasExperience)

  let blockedReason: ReviewBlockedReason | null = null
  if (!review) {
    if (!isReleased) blockedReason = 'unreleased'
    else if (!isEligible) blockedReason = 'status'
  }

  return {
    blockedReason,
    inLibrary,
    inBacklog,
    isLoading:
      isLoadingStatus ||
      isReviewLoading ||
      (inBacklog && (isFetchingHours || isFetchingCompletions))
  }
}
